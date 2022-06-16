const { matchedData, validationResult } = require('express-validator');
const User = require('../models/User');
const Listing = require('../models/Listing');
const ListingStatusTypes = require('../models/ListingStatusTypes');
const ListingTypes = require('../models/ListingTypes');
const ListingReviews = require('../models/ListingReviews');
const ListingFavorites = require('../models/ListingFavorites');
const DayTrips = require('../models/DayTrips');
const OvernightStays = require('../models/OvernightStays');
const WaterActivity = require('../models/WaterActivity');
const WaterActivityTypes = require('../models/WaterActivityTypes');
const Insurance = require('../models/Insurance');
const AmenitiesInterior = require('../models/AmenitiesInterior');
const AmenitiesSafety = require('../models/AmenitiesSafety');
const AmenitiesWaterToys = require('../models/AmenitiesWaterToys');
const Availability = require('../models/Availability');
const CancelationPolicy = require('../models/CancelationPolicy');
const Exterior = require('../models/Exterior');
const { v4: uuidv4 } = require('uuid');
const NodeGeocoder = require('node-geocoder');

const { calculateListingPricing } = require('../utils/stripe-utils');

const { raw } = require('objection');

/**
Listings
**/

const geoCodeOptions = {
  provider: 'google',

  // Optional depending on the providers
  apiKey: 'AIzaSyBs0n09_o7OmadZvIq6-lBhvPXLGhuQuVo', // for Mapquest, OpenCage, Google Premier
};

const createListing = async (req, res, next) => {
  let user_id = parseInt(req.user.id);

  if(!req.body.listing){
    return res.status(400).send({error:"Missing listing payload data."}); // 204: No content
  };

  if(!req.body.interior){
    return res.status(400).send({error:"Missing interior payload data."}); // 204: No content
  };

  if(!req.body.exterior){
    return res.status(400).send({error:"Missing exterior payload data."}); // 204: No content
  };

  if(!req.body.safety){
    return res.status(400).send({error:"Missing safety payload data."}); // 204: No content
  };


  if(!req.body.water_toys){
    return res.status(400).send({error:"Missing water_toys payload data."}); // 204: No content
  };


  if(!req.body.overnight_stays){
    return res.status(400).send({error:"Missing overnight_stays payload data."}); // 204: No content
  };


  if(!req.body.day_trips){
    return res.status(400).send({error:"Missing day_trips payload data."}); // 204: No content
  };


  if(!req.body.water_activity){
    return res.status(400).send({error:"Missing water_activity payload data."}); // 204: No content
  };

  if(!req.body.availability){
    return res.status(400).send({error:"Missing availability payload data."}); // 204: No content
  };

  if(!req.body.cancelation_policy){
    return res.status(400).send({error:"Missing cancelation_policy payload data."}); // 204: No content
  };

  if(!req.body.insurance){
    return res.status(400).send({error:"Missing insurance payload data."}); // 204: No content
  };


  const { listing, interior, exterior, safety, water_toys, overnight_stays, day_trips, water_activity, availability, cancelation_policy, insurance} = req.body;

  try {
    let parsedData = JSON.parse(listing)
    let listingPayload = {...parsedData, user_id:user_id}

    //console.log(listingPayload)
    const newListing = await Listing
        .query()
        .insert(listingPayload)
        .then(listing => {return listing})

    console.log("Listing created...")
    let parsedData2 = JSON.parse(interior)
    let interiorPayload = {...parsedData2, listing_id:newListing.listing_id}
    const newInterior = await AmenitiesInterior
        .query()
        .insert(interiorPayload)
        .then(interior => {return interior})

    console.log("Listing Interior created...")
    let parsedData3 = JSON.parse(exterior)
    let exteriorPayload = {...parsedData3, listing_id:newListing.listing_id}
    const newExterior = await Exterior
        .query()
        .insert(exteriorPayload)
        .then(exterior => {return exterior})

    console.log("Listing Exteriror created...")
    let parsedData4 = JSON.parse(safety)
    let safetyPayload = {...parsedData4, listing_id:newListing.listing_id}
    const newSafety = await AmenitiesSafety
        .query()
        .insert(safetyPayload)
        .then(safety => {return safety})

    console.log("Listing Water Toys created...")
    let parsedData5 = JSON.parse(water_toys)
    let toysPayload = {...parsedData5, listing_id:newListing.listing_id}
    const newToys = await AmenitiesWaterToys
        .query()
        .insert(toysPayload)
        .then(toys => {return toys})

    console.log("Listing Safety created...")
    let parsedData6 = JSON.parse(overnight_stays)
    let overnight_stay_payload = {...parsedData6, listing_id:newListing.listing_id}
    const newOvernights = await OvernightStays
        .query()
        .insert(overnight_stay_payload)
        .then(onstays => {return onstays})

    console.log("Listing Overnights created...")
    let parsedData7 = JSON.parse(day_trips)
    let day_trips_payload = {...parsedData7, listing_id:newListing.listing_id}
    const newDayTrips = await DayTrips
        .query()
        .insert(day_trips_payload)
        .then(daytrips => {return daytrips})

    console.log("Listing Day Trips created...")

    // let water_activity_payload = {...exterior, listing_id:newListing.listing_id}
    // const newDayTrips = await DayTrips
    //     .query()
    //     .insert(water_activity_payload)
    //     .then(daytrips => {return daytrips})
    let parsedData8 = JSON.parse(availability)
    let avail_payload = {...parsedData8, how_far_in_advance_book: JSON.stringify(availability.how_far_in_advance_book) ,listing_id:newListing.listing_id}
    const newAvailability = await Availability
        .query()
        .insert(avail_payload)
        .then(avail => {return avail})

    console.log("Listing Availability created...")
    let parsedData9 = JSON.parse(cancelation_policy)
    let cancel_payload = {...parsedData9, listing_id:newListing.listing_id}
    const newCancelation = await CancelationPolicy
        .query()
        .insert(cancel_payload)
        .then(cancel => {return cancel})

    console.log("Listing Cancellation created...")
    let parsedData10 = JSON.parse(insurance)
    let insurance_payload = {...parsedData10, listing_id:newListing.listing_id}
    const newInsurance = await Insurance
        .query()
        .insert(insurance_payload)
        .then(insurance => {return insurance})

    let multipleFileQuery = [];

    for (const file in req.files) {
      const { filename, size, mimetype, key, bucket, location } = req.files[file];
        let fileData = {
         key,
         mimetype,
         size,
         filename,
         location,
         uniqueID: uuidv4(),
       }
     multipleFileQuery.push(fileData)
    }

      console.log(multipleFileQuery)
      console.log(newListing)
      console.log(newInterior)
      console.log(newExterior)
      console.log(newSafety)
      console.log(newToys)
      console.log(newOvernights)
      console.log(newDayTrips)
      console.log(newAvailability)
      console.log(newCancelation)
      console.log(newInsurance)

      let updatedListing = newListing

      if (multipleFileQuery.length > 0) {
        let imageUpdatePayload = {...newListing, images:JSON.stringify(multipleFileQuery)}

        updatedListing = await Listing
            .query()
            .findOne({listing_id:newListing.listing_id})
            .patchAndFetchById(newListing.listing_id, imageUpdatePayload)
            .then(listing => {return listing})
      }

    if (updatedListing) {
      return res.status(200).json(updatedListing)
    }else{
      return res.status(404).json({msg:"Listing could not be created."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
}

const updateListing = async (req, res, next) => {
  let user_id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });
  const validBody = matchedData(req, { locations: ['body'] });

  const { id } = validParams;

  //const { marina_name } = validBody;

  try {
      //Check if the authorized user can edit this.
      let existingListing = await Listing
          .query()
          .findOne({listing_id:id, user_id:user_id})
          .then(listing => {return listing})

      if (!existingListing) {
        return res.status(403).send({error:"You do not have permission to edit this listing."}); // 204: No content
      }

      const updatedListing = await Listing
          .query()
          .patchAndFetchById(id, validBody)
          .eager('[exterior, amenities_interior, amenities_safety, amenities_water_toys, cancelation_policy, day_trip_related, availability, water_activity, overnights_related, owner, insurance, listing_type ]')
          .then(listing => {return listing})

    if (updatedListing) {
      return res.status(200).json(updatedListing)
    } else {
      res.status(404).send({error:"Listing not found, or invalid permissions. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }

}

const deleteListing = async (req, res, next) => {

  let user_id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  //TODO: Add in deletion of other related datamodels : Availability, Day or Night trips, Amentiies, Exteriror, Etc.

  //avoid full deletion for now.
  let deleted = await Listing
      .query()
      .findOne({listing_id:id, user_id:user_id})
      .update({archived:true})
      .then(listing => {return listing});

    if (deleted) {
      res.status(200).json({msg:"Listing successfully deleted."});
    } else {
      res.status(404).send({error:"Listing not found, or invalid permissions. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getListingByUserId = async (req, res, next) => {

  let user_id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

    let listing = []

    if (user_id === parseInt(id)) {
      listing = await Listing
          .query()
          .where('user_id','=', id)
          .eager('[exterior, amenities_interior, amenities_safety, amenities_water_toys, cancelation_policy, day_trip_related, availability, water_activity, overnights_related, insurance, listing_type, status, reviews, bookings]')
          .orderBy('created_at', 'desc')
          .then(listing => {return listing});
    }else{
      listing = await Listing
          .query()
          .where('user_id','=', id)
          .eager('[exterior, amenities_interior, amenities_safety, amenities_water_toys, cancelation_policy, day_trip_related, availability, water_activity, overnights_related, insurance, listing_type, status, reviews]')
          .orderBy('created_at', 'desc')
          .then(listing => {return listing});
    }


    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).send({error:"Listing not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getRecentListingsByUserId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let listing = await Listing
      .query()
      .where('user_id','=', id)
      .eager('[exterior, amenities_interior, amenities_safety, amenities_water_toys, cancelation_policy, day_trip_related, availability, water_activity, overnights_related, owner, insurance, listing_type ]')
      .orderBy('created_at', 'desc')
      .limit(5)
      .then(listing => {return listing});

    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).send({error:"Listing not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getListingByIdWithAdditionalDetails = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let listing = await Listing
      .query()
      .findOne({listing_id:id})
      .eager('[exterior, amenities_interior, amenities_safety, amenities_water_toys, cancelation_policy, day_trip_related, availability, water_activity, overnights_related, owner, insurance, listing_type, reviews.[renter]]')
      .then(listing => {return listing});

    if (listing) {
      res.status(200).json(listing);
    } else {
      res.status(404).send({error:"Listing not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}


const getListingPricing = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });
  const validBody = matchedData(req, { locations: ['body'] });

  const { id } = validParams;


  const { guest_capacity, dates, start_date, end_date, duration} = validBody;


  try {
      //Check if the authorized user can edit this.
      let existingListing = await Listing
          .query()
          .findOne({listing_id:id})
          .eager('[status, day_trip_related, overnights_related, amenities_interior]')
          .then(listing => {return listing})

      if (!existingListing) {
        return res.status(403).send({error:"No listing exists."}); // 204: No content
      }

      pricingData = await calculateListingPricing({existingListing:existingListing, duration:duration})

    if (pricingData) {
      return res.status(200).json(pricingData)
    } else {
      res.status(404).send({error:"Listing not found, or invalid permissions. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }

}

const getAllListingsPaginated = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validQuery = matchedData(req, { locations: ['query'] });

  const geocoder = NodeGeocoder(geoCodeOptions);

  const { page, count, list_type, location, duration, start_charter, end_charter, size_min, size_max, price_min, price_max, water_toys, more  } = validQuery;

  if(count < 0 || count > 200){
    return res.status(500).json({msg:"Count can not be less than 0 or more than 200 results."})
  }

  let page_index = page - 1
  try {
    let response = {}
    let pages = 0
      let query = null

      if(location === null || location === undefined || location === ' '){
        query = await Listing
          .query()
          .eager('[status, day_trip_related, overnights_related, amenities_interior]')
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }else{
            if (start_charter !== "" && end_charter !== "" && size_min && size_max && price_min && price_max && water_toys !== "null" && more !== "null" ) {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                .where('')
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)
            }else if (start_charter !== "" && end_charter !== "" && size_min && size_max && price_min && price_max && water_toys !== "null") {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)
            }else if (start_charter !== "" && end_charter !== "" && size_min && size_max && price_min && price_max) {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)
            }else if (start_charter !== "" && end_charter !== "" && size_min && size_max) {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)
            }else if (start_charter !== "" && end_charter !== "" && price_min && price_max) {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)

            }else if (size_min && size_max && size_min !== "0" && size_max !== "0") {
              query = await Listing
                .query()
                .where(builder => builder.where(raw('city'), 'like', `%${location}%`).andWhere('length','>', parseInt(size_min)).andWhere('length','<', parseInt(size_max)))
                .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                .orderBy('created_at', 'desc')
                .page(page_index, count)
            }else if (price_min && price_max && price_max !== "0") {
                  if (list_type === "day-trips") {
                    query = await Listing
                      .query()
                      .joinRelation('day_trip_related')
                      .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                      .where('day_trip_related.price_for_4_hours', '<=', parseFloat(price_max))
                      .where('day_trip_related.price_for_6_hours', '<=', parseFloat(price_max))
                      .where('day_trip_related.price_for_8_hours', '<=', parseFloat(price_max))

                      .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                      .orderBy('created_at', 'desc')
                      .page(page_index, count)
                  }else if (list_type === "water-activity") {
                    query = await Listing
                      .query()
                      .joinRelation('overnights_related')
                      .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                      .where('overnights_related.price_per_day', '<=', parseFloat(price_max))
                      .where('overnights_related.price_per_day', '>=', parseFloat(price_min))
                      .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                      .orderBy('created_at', 'desc')
                      .page(page_index, count)
                  }else {
                    query = await Listing
                      .query()
                      .joinRelation('overnights_related')
                      .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                      .where('overnights_related.price_per_day', '<=', parseFloat(price_max))
                      .where('overnights_related.price_per_day', '>=', parseFloat(price_min))
                      .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                      .orderBy('created_at', 'desc')
                      .page(page_index, count)
                  }

            }
            else{
              if (list_type === 'overnights') {
                query = await Listing
                  .query()
                  .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                  .where('overnight_stays', '=', 1)
                  .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                  .orderBy('created_at', 'desc')
                  .page(page_index, count)
              }else if (list_type === 'day-trips') {
                query = await Listing
                  .query()
                  .where('day_trips', '=', 1)
                  .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                  .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                  .orderBy('created_at', 'desc')
                  .page(page_index, count)
              }else{
                query = await Listing
                  .query()
                  .where('overnight_stays', '=', 1)
                  .where('day_trips', '=', 1)
                  .where(builder => builder.where(raw('city'), 'like', `%${location}%`))
                  .eager('[status, day_trip_related, overnights_related, amenities_interior]')
                  .orderBy('created_at', 'desc')
                  .page(page_index, count)
              }


            }
      }
      pages = Math.ceil(query.total / count)

      let locationData = null
      if (query.results.length > 0) {
        if (query.results[0].province !== null && query.results[0].province !== undefined) {
          console.log(`${query.results[0].city} ${query.results[0].province} ${query.results[0].country}`)
          locationData = await geocoder.geocode(`${query.results[0].city} ${query.results[0].province} ${query.results[0].country}`);
        }else{
          console.log(`${query.results[0].city} ${query.results[0].country}`)
          locationData = await geocoder.geocode(`${query.results[0].city} ${query.results[0].country}`);
        }

      }
      response = {...query, pages:pages, locationData:locationData}
      return res.json(response)
    }
  catch (error) {
    console.log(error)
    return res.status(500).json({msg:"Search request could not be completed."})
  }
}

const getAllListingsByTypePaginated = async (req, res, next) => {

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
    if (type === 'boats'){
      let query = null
      if(search === null || search === undefined || search === ' '){
        query = await Listing
          .query()
          .where('listing_type_id', '=', 1)
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }else{
        query = await Listing
          .query()
          .where('listing_type_id', '=', 1)
          .where(builder => builder.where(raw('listing_name'), 'like', `%${search}%`).orWhere(raw('location'), 'like', `%${search}%`))
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }
      pages = Math.ceil(query.total / count)
      response = {...query, pages:pages}
    }else if (type === 'yachts'){
      let query = null
      if(search === null || search === undefined || search === ' '){
        query = await Listing
          .query()
          .where('listing_type_id', '=', 2)
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }else{
        query = await Listing
          .query()
          .where('listing_type_id', '=', 2)
          .where(builder => builder.where(raw('listing_name'), 'like', `%${search}%`).orWhere(raw('location'), 'like', `%${search}%`))
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }
      pages = Math.ceil(query.total / count)
      response = {...query, pages:pages}
    }else if (type === 'water-activities'){
      let query = null
      if(search === null || search === undefined || search === ' '){
        query = await Listing
          .query()
          .where('listing_type_id', '=', 3)
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }else{
        query = await Listing
          .query()
          .where('listing_type_id', '=', 3)
          .where(builder => builder.where(raw('listing_name'), 'like', `%${search}%`).orWhere(raw('location'), 'like', `%${search}%`))
          .orderBy('created_at', 'desc')
          .page(page_index, count)
      }
      pages = Math.ceil(query.total / count)
      response = {...query, pages:pages}
    }
    else {
      response = {results:[], total:0, pages:0}
    }
    return res.json(response)
  } catch (error) {
    next(error);
  }
}

const getAllListingTypes = async (req, res, next) => {
  try {
    let types = await ListingTypes
        .query()
        .then(types => {return types});
    if (types) {
      res.status(200).json(types);
    } else {
      res.status(200).send({error:"Types not found. Please check databse for existing types."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"A server error has occurred. Please try again later."})
  }
}

/**
Water Activities
**/

const getWaterActivityTypes = async (req, res, next) => {
  try {
    let types = await WaterActivityTypes
        .query()
        .then(types => {return types});
    if (types) {
      res.status(200).json(types);
    } else {
      res.status(200).send({error:"Types could not be retrieved. Internal retrieval error..."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"A server error has occurred. Please try again later."})
  }
}

const getWaterActivityTypesForOwner = async (req, res, next) => {
  try {
    let types = await WaterActivityTypes
        .query()
        .where('active','=', true)
        .then(types => {return types});
    if (types) {
      res.status(200).json(types);
    } else {
      res.status(404).send({error:"Types could not be retrieved. Internal retrieval error..."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:"A server error has occurred. Please try again later."})
  }
}

const getWaterActivityTypeById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let waterActivity = await WaterActivityType
      .query()
      .findOne({id:id})
      .then(activity => {return activity});

    if (waterActivity) {
      res.status(200).json(waterActivity);
    } else {
      res.status(404).send({error:"Water activity not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const createWaterActivityType = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { active, water_activity_type_name } = validBody;

  try {

    const newType = await WaterActivityTypes
        .query()
        .insert(validBody)
        .then(type => {return type})

    if (newType) {
      return res.status(200).json(newType)
    }else{
      return res.status(404).json({msg:"Water Activity could not be created."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
  }
}
//Done
const updateWaterActivityType = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  const { active, water_activity_type_name } = validBody;

  try {

    const newType = await WaterActivityTypes
        .query()
        .patchAndFetchById(id, validBody)
        .then(type => {return type})

    if (newType) {
      return res.status(200).json(newType)
    }else{
      return res.status(404).json({msg:"Water Activity could not be updated."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
  }
}

const deleteWaterActivityType = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let deleted = await WaterActivityType
      .query()
      .findOne({id:id})
      .delete()

    if (deleted) {
      res.status(200).json({msg:"Deletion of water activity type successful."});
    } else {
      res.status(404).send({error:"Water activity type not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

/**
Reviews
**/

const createReviewForListing = async (req, res, next) => {
  let user_id = parseInt(req.user.id);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { owner_id, renter_id, listing_id, review_comment } = validBody;

  try {
    const listing = await Listing
        .query()
        .findOne({listing_id:listing_id})
        .then(listing => {return listing})

    if (!listing) {
      return res.status(404).json({msg:"Listing does not exist, review not made."})
    }


    const existingReview = await ListingReviews
        .query()
        .findOne({listing_id:listing_id, renter_id:user_id})
        .then(review => {return review})

    if (existingReview) {
      return res.status(400).json({msg:"A review for this listing by this user has been made already."})
    }

    const newReview = await ListingReviews
        .query()
        .insert(validBody)
        .then(review => {return review})

    if (newReview) {
      return res.status(200).json(newReview)
    }else{
      return res.status(404).json({msg:"Listing does not exist, review not made."})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
}

const updateReviewForListing = async (req, res, next) => {
  //et id = parseInt(req.user.id);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ['body'] });

  const { review_responded, review_response } = validBody;

  try {
    //Update user with updated socials.
    const updatedReview = await ListingReviews
        .query()
        .patchAndFetchById(id, validBody)
        .then(review => {return review})

    return res.status(200).json(updatedReview)

  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:"A server error has occurred, please try again later or contact support."})
    ///next(error);
  }
}

const deleteReviewForListing = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let review = await ListingReviews
      .query()
      .findOne({id:id})
      .delete()

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).send({error:"Review not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getReviewById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let review = await ListingReviews
      .query()
      .findOne({id:id})
      .then(review => {return review});

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).send({error:"Review not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getReviewsByListingId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let review = await ListingReviews
      .query()
      .findOne({listing_id:id})
      .then(review => {return review});

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).send({error:"Review not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

const getReviewsByUserId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ['params'] });

  const { id } = validParams;

  try {

  let review = await ListingReviews
      .query()
      .findOne({owner_id:id})
      .then(review => {return review});

    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).send({error:"Review not found. Please try again with a valid id."}); // 204: No content
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"A server error has occurred. Please try again later."})
  }
}

module.exports = {createListing, updateListing, deleteListing, getListingByUserId, getRecentListingsByUserId, getListingByIdWithAdditionalDetails, getAllListingsPaginated, getAllListingsByTypePaginated,
getAllListingTypes, getWaterActivityTypes, getWaterActivityTypesForOwner, getWaterActivityTypeById, createWaterActivityType, updateWaterActivityType, deleteWaterActivityType,
createReviewForListing, updateReviewForListing, deleteReviewForListing, getReviewById, getReviewsByListingId, getReviewsByUserId, getListingPricing};
