const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const Listing = require('../models/Listing');

const { raw } = require('objection');

const searchAllPaginated = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validQuery = matchedData(req, { locations: ['query'] });

  const { type, page, search, count, filter } = validQuery;

  if(count < 0 || count > 200){
    return res.status(500).json({msg:"Count can not be less than 0 or more than 200 results."})
  }

  let page_index = page - 1
  try {
    let response = {}
    let pages = 0
    if (type === 'users'){
      let query = null
      if(search === null || search === undefined || search === ' '){
        query = await User
          .query()
          .where('role_id', '=', 1)
          .where('id', '!=', req.user.id)
          .omit(['password'])
          .eager('[role.[permissions]]')
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }else{
        query = await User
          .query()
          .where('role_id', '=', 1)
          .where('id', '!=', req.user.id)
          .where(builder => builder.where(raw('first_name'), 'like', `%${search}%`).orWhere(raw('username'), 'like', `%${search}%`))
          .omit(['password'])
          .eager('[role.[permissions]]')
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }
      pages = Math.ceil(query.total / count)
      response = {...query, pages:pages}
    }else {
      response = {results:[], total:0, pages:0}
    }
    return res.json(response)
  } catch (error) {
    next(error);
  }
}

const autocompleteLocation = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validQuery = matchedData(req, { locations: ['query'] });

  const { search } = validQuery;


  try {

    let query = await Listing
      .query()
      .select('city', 'province', 'country' ,'listing_name')
      .where(builder => builder.where(raw('city'), 'like', `%${search}%`).orWhere(raw('province'), 'like', `%${search}%`))
      .then(listings => {return listings})

    let uniqueLocationList = query.filter((a, i) => query.findIndex((s) => a.city === s.city) === i)

    return res.json(uniqueLocationList)

  } catch (error) {
    next(error);
  }
}


module.exports = { searchAllPaginated, autocompleteLocation };
