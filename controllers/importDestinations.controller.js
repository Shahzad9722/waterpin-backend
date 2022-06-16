const Destination = require("../models/Destinations");
const readXlsxFile = require("read-excel-file/node");
let upload = require("../config/multer.config");

exports.uploadFile = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        let msg = null;
        if (error.message) msg = error.message;
        else msg = error;
        return res.status(400).json({ success: false, message: msg });
      } else {
        if (req.file == undefined) {
          return res
            .status(404)
            .json({ success: false, message: "Please Upload a File" });
        } else {
          let filePath = __basedir + "/uploads/" + req.file.filename;

          await readXlsxFile(filePath).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log(rows);

            if (
              // rows[0][0] !== "destination_name" ||
              // rows[0][1] !== "location" ||
              // rows[0][2] !== "map_location" ||
              // rows[0][3] !== "lat_delta" ||
              // rows[0][4] !== "long_delta" ||
              // rows[0][5] !== "destination_image" ||
              // rows[0][6] !== "city_name" ||
              // rows[0][7] !== "city_state" ||
              // rows[0][8] !== "city_province" ||
              // rows[0][9] !== "city_zipcode" ||
              // rows[0][10] !== "city_country" ||
              // rows[0][11] !== "city_country_code" ||
              // rows[0][12] !== "city_images" ||
              // rows[0][13] !== "city_location" ||
              // rows[0][14] !== "city_description" ||
              // rows[0][15] !== "destination_review_avg"
              rows[0][0] !== "destination_name" ||
              rows[0][1] !== "lat_delta" ||
              rows[0][2] !== "long_delta" ||
              rows[0][3] !== "destination_image" ||
              rows[0][4] !== "city_location" ||
              rows[0][5] !== "city_province" ||
              rows[0][6] !== "city_zipcode" ||
              rows[0][7] !== "city_country" ||
              rows[0][8] !== "city_country_code" ||
              rows[0][9] !== "city_images" ||
              rows[0][10] !== "city_description" ||
              rows[0][11] !== "destination_review_avg"
              // rows[0][5] !== "city_name" ||
              // rows[0][7] !== "city_state" ||
            ) {
              const result = {
                success: false,
                message: "Wrong File or Invalid Columns",
              };
              return res.json(result);
            }

            // Remove Header ROW
            rows.shift();

            const destinations = [];

            let length = rows.length;

            console.log(length);

            // for (let j = 0; j < length; j++) {
            //   if (
            //     !rows[j][0] ||
            //     !rows[j][1] ||
            //     !rows[j][2] ||
            //     !rows[j][3] ||
            //     !rows[j][4] ||
            //     !rows[j][5] ||
            //     !rows[j][6] ||
            //     !rows[j][7] ||
            //     !rows[j][8] ||
            //     !rows[j][9] ||
            //     !rows[j][10] ||
            //     !rows[j][11]
            //     // !rows[j][12] ||
            //     // !rows[j][13] ||
            //     // !rows[j][14] ||
            //     // !rows[j][15]
            //   ) {
            //     const result = {
            //       success: false,
            //       message: "Missing Columns",
            //     };
            //     return res.json(result);
            //   }
            // }

            for (let i = 0; i < length; i++) {
              let destination = {
                // destination_name: rows[i][0],
                // location: rows[i][1],
                // map_location: JSON.stringify(rows[i][2]),
                // lat_delta: rows[i][3],
                // long_delta: rows[i][4],
                // destination_image: rows[i][5],
                // city_name: rows[i][6],
                // city_state: rows[i][7],
                // city_province: rows[i][8],
                // city_zipcode: rows[i][9],
                // city_country: rows[i][10],
                // city_country_code: rows[i][11],
                // city_images: JSON.stringify(rows[i][12]),
                // city_location: rows[i][13],
                // city_description: rows[i][14],
                // destination_review_avg: rows[i][15],
                destination_name: rows[i][0],
                lat_delta: rows[i][1],
                long_delta: rows[i][2],
                destination_image: rows[i][3],
                city_location: rows[i][4],
                city_province: rows[i][5],
                city_zipcode: rows[i][6],
                city_country: rows[i][7],
                city_country_code: rows[i][8],
                city_images: JSON.stringify(rows[i][9]),
                city_description: rows[i][10],
                destination_review_avg: rows[i][11],
              };
              destinations.push(destination);
            }
            Destination.query()
              .insert(destinations)
              .then(() => {
                const result = {
                  success: true,
                  message: "Destinations have been Added",
                };
                res.json(result);
              });
          });
        }
      }
    });
  } catch (error) {
    const result = {
      success: false,
      message: error.message,
    };
    res.json(result);
  }
};
