const express = require('express');
const router = express.Router();
const {createListing, updateListing, deleteListing, getListingByUserId, getRecentListingsByUserId, getListingByIdWithAdditionalDetails, getAllListingsPaginated, getAllListingsByTypePaginated,
getAllListingTypes, getWaterActivityTypes, getWaterActivityTypesForOwner, getWaterActivityTypeById, createWaterActivityType, updateWaterActivityType, deleteWaterActivityType,
createReviewForListing, updateReviewForListing, deleteReviewForListing, getReviewById, getReviewsByListingId, getReviewsByUserId, getListingPricing} = require( '../../controllers/listing.controller');
const { query, check, param} = require('express-validator');
// const { listingUpload } = require('../../utils/s3/listing');

/**
 * @route POST /listing/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
// router.post('/', listingUpload.array('files[]', 10), createListing);

/**
 * @route PATCH /listing/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/:id',[
  param('id').exists(),
  check('location').optional({nullable: true}),
  check('marina_name').exists(),
  check('dock').optional({nullable: true}),
  check('slip_number').optional({nullable: true}),
  check('country').optional({nullable: true}),
  check('street_address').optional({nullable: true}),
  check('state').optional({nullable: true}),
  check('province').optional({nullable: true}),
  check('list_details').optional({nullable: true}),
  check('list_details_operator').optional({nullable: true}),
  check('list_details_name').optional({nullable: true}),
  check('list_details_type').optional({nullable: true}),
  check('list_details_make').optional({nullable: true}),
  check('model').optional({nullable: true}),
  check('year').optional({nullable: true}),
  check('length').optional({nullable: true}),
  check('rules').optional({nullable: true}),
  check('listing_name').optional({nullable: true}),
  check('list_description').optional({nullable: true}),
  check('day_trips').optional({nullable: true}),
  check('overnight_stays').optional({nullable: true}),
  check('listing_type_id').optional({nullable: true}),
  check('listing_status').optional({nullable: true}),
], updateListing);


/**
 * @route DELETE /listing/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/:id', param('id').exists(), deleteListing);


/**
 * @route GET /listing/user/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/user/:id',param('id').exists(), getListingByUserId);


/**
 * @route GET /listing/user/:id/recent
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/user/:id/recent',param('id').exists(), getRecentListingsByUserId);



/**
 * @route GET /listing/:id/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/:id',param('id').exists(), getListingByIdWithAdditionalDetails);


/**
 * @route POST /listing/:id/pricing
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/:id/pricing',[
param('id').exists(),
check('duration').exists(),
check('guest_capacity').exists(),
check('start_date').exists(),
check('end_date').exists(),
], getListingPricing);



/**
 * @route GET /listing/?search=
 * @group Listing
 * @returns {Array.<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/',[
query('location').exists(),
query('duration').exists(),
query('list_type').exists(),
query('start_charter').exists(),
query('end_charter').exists(),
query('size_min').exists(),
query('size_max').exists(),
query('price_min').exists(),
query('price_max').exists(),
query('water_toys').exists(),
query('more').exists(),
query('page').exists(),
query('count').exists(),
], getAllListingsPaginated);


/**
 * @route GET  /listing/?type=type&&search=
 * @group Listing
 * @returns {Array.<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/type/',[query('type').isLength({ min: 5, max:15 }),
query('search').exists(),
query('page').exists(),
query('count').exists(),
query('filter').exists()
], getAllListingsByTypePaginated);


/**
 * @route GET /listing/listing-types/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/listing-types', getAllListingTypes);


/**
 * @route GET /listing/water-activities-types/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/water-activities-types', getWaterActivityTypes);


/**
 * @route GET /listing/water-activities-types/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/water-activities-types-owner', getWaterActivityTypesForOwner);


/**
 * @route GET /listing/water-activities-types/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/water-activities-types/:id', param('id').exists(), getWaterActivityTypeById);


/**
 * @route POST /listing/water-activities-types/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/water-activities-types',[
check('water_activity_type_name').exists(),
], createWaterActivityType);


/**
 * @route PATCH /listing/water-activities-types/
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/water-activities-types/:id',[
check('water_activity_type_name').exists(),
check('active').exists(),
param('id').exists(),
], updateWaterActivityType);


/**
 * @route GET /listing/water-activities-types/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/water-activities-types/:id', param('id').exists(), deleteWaterActivityType);

/**
 * @route GET /listing/reviews/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/reviews/:id', getReviewById);



/**
 * @route GET /listing/reviews-by-listing/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/reviews-by-listing/:id', param('id').exists(), getReviewsByListingId);



/**
 * @route GET /listing/reviews/:id
 * @group Listing
 * @returns {<ListingResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.get('/reviews/user/:id', param('id').exists(), getReviewsByUserId);


/**
 * @route POST /listing/reviews/
 * @group ListingReview
 * @returns {<ListingReviewResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.post('/reviews',[
  check('owner_id').exists(),
  check('review_comment').exists(),
  check('rating_kindness').exists(),
  check('rating_communication').exists(),
  check('rating_service').exists(),
], createReviewForListing);


/**
 * @route PATCH /listing/reviews/:id
 * @group Listing
 * @returns {<ListingReviewResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.patch('/reviews',[
 check('review_response').exists(),
 check('review_responded').exists(),
], updateWaterActivityType);


/**
 * @route Delete /listing/reviews/:id
 * @group Listing
 * @returns {<ListingReviewResponse>} 200
 * @returns {any} 401 - Unauthorized
 * @returns {any} 500 - Internal error
 * @security JWT
 */
router.delete('/reviews/:id', param('id').exists(), deleteReviewForListing);


module.exports = router;
