const { matchedData, validationResult } = require("express-validator");
const User = require("../models/User");
const Destinations = require("../models/Destinations");
const NodeGeocoder = require('node-geocoder');

const { raw } = require("objection");

const geoCodeOptions = {
  provider: 'google',

  // Optional depending on the providers
  apiKey: 'AIzaSyBs0n09_o7OmadZvIq6-lBhvPXLGhuQuVo', // for Mapquest, OpenCage, Google Premier
};

const getAllDestinationsPaginated = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validQuery = matchedData(req, { locations: ["query"] });

  const { region, page, search, count } = validQuery;

  if (count < 0 || count > 200) {
    return res
      .status(500)
      .json({ msg: "Count can not be less than 0 or more than 200 results." });
  }

  let page_index = page - 1;
  try {
    let response = {};
    let pages = 0;
    if (region) {
      let query = null;
      if (search === null || search === undefined || search === " ") {
        query = await Destination.query()
          .where("region", "=", region)
          .orderBy("created_at", "desc")
          .page(page_index, count);
      } else {
        query = await Destination.query()
          .orderBy("created_at", "desc")
          .page(page_index, count);
      }
      pages = Math.ceil(query.total / count);
      response = { ...query, pages: pages };
    } else {
      response = { results: [], total: 0, pages: 0 };
    }
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const getDestinationsPaginated = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validQuery = matchedData(req, { locations: ["query"] });

  const { type, page, count, city_province } = validQuery;

  if (count < 0 || count > 200) {
    return res
      .status(500)
      .json({ msg: "Count can not be less than 0 or more than 200 results." });
  }

  let page_index = page - 1;

  const geocoder = NodeGeocoder(geoCodeOptions);


  try {
    let response = {};
    let pages = 0;
    let query = null;
    if (city_province === "All") {
      query = await Destinations.query().page(page_index, count);
      pages = Math.ceil(query.total / count);
      response = { ...query, pages: pages };
    } else {
      query = await Destinations.query()
        .where("city_province", "=", city_province)
        .page(page_index, count);
      pages = Math.ceil(query.total / count);
      response = { ...query, pages: pages };
    }

    let locationData = null

    if (query.results.length > 0) {
      if (query.results[0].city_province !== null && query.results[0].city_province !== undefined) {
        locationData = await geocoder.geocode(`${query.results[0].city_province} ${query.results[0].city_country}`);
      }else{
        locationData = await geocoder.geocode(`${query.results[0].city_country}`);
      }
    }

    response = {...response, location_data:locationData}
    // if (type === "destinations") {
    //   let query = null;
    //   query = await Destinations.query().page(page_index, count);
    //   pages = Math.ceil(query.total / count);
    //   response = { ...query, pages: pages };
    // } else {
    //   response = { results: [], total: 0, pages: 0 };
    // }
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

const createDestination = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validBody = matchedData(req, { locations: ["body"] });

  const { destination_name, location, map_location, lat_delta, long_delta } = validBody;

  try {
    const newDestination = await Destinations.query()
      .insert(validBody)
      .then((dest) => {
        return dest;
      });

    if (newDestination) {
      return res.status(200).json(newDestination);
    } else {
      return res.status(500).json({ msg: "Destination could not be created." });
    }
  } catch (error) {
    next(error);
  }
};

const updateDestination = async (req, res, next) => {
  try {
    res.json({ info: "Waterpin - API v2.0.0" });
  } catch (error) {
    next(error);
  }
};

const deleteDestination = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ["params"] });

  const { id } = validParams;

  try {
    const deletedDestination = await Destinations.query()
      .findOne({ id: id })
      .delete();

    if (deletedDestination) {
      return res.status(200).json(deletedDestination);
    } else {
      return res
        .status(404)
        .json({ msg: "Booking could not be found with this ID." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "A server error has occurred, please try again later or contact support.",
    });
    ///next(error);
  }
};

const getDestinationById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ["params"] });

  const { id } = validParams;

  try {
    const destination = await Destinations.query()
      .findOne({ id: id })
      .eager("[cities]")
      .then((dest) => {
        return dest;
      });

    if (destination) {
      return res.status(200).json(destination);
    } else {
      return res
        .status(404)
        .json({ msg: "Destination could not be found with this ID." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "A server error has occurred, please try again later or contact support.",
    });
  }
};

const getAllCitiesByDestinationId = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const validParams = matchedData(req, { locations: ["params"] });

  const { destination_id } = validParams;

  try {
    const destination = await Destination.query()
      .where("destination_id", "=", destination_id)
      .then((dest) => {
        return dest;
      });

    if (destination) {
      return res.status(200).json(destination);
    } else {
      return res.status(404).json({
        msg: "No destination cities could not be found with this destination ID.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "A server error has occurred, please try again later or contact support.",
    });
  }
};

const getAllDestinations = async (req, res, next) => {
  try {
    const destinations = await Destinations.query();
    if (destinations) {
      return res.status(200).json(destinations);
    } else {
      return res.status(404).json({
        msg: "No destinations Found.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "A server error has occurred, please try again later or contact support.",
    });
  }
};

module.exports = {
  getAllDestinations,
  getAllDestinationsPaginated,
  getDestinationsPaginated,
  createDestination,
  deleteDestination,
  getDestinationById,
};
