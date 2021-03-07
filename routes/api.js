require("dotenv").config();
const express = require("express");
const router = express.Router();
var _ = require("lodash");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const async = require("async");
const { GoogleSpreadsheet } = require("google-spreadsheet");

router.get("/googlesheet", async (req, res) => {
  const Data = [
    { name: "den", id: 123 },
    { name: "gana", id: 456 },
  ]; //this is the data that will be entere din the sheet

  if (!Data) {
    return;
  }
  let [value] = Data;
  let header = Object.keys(value);
  const auth = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY,
    [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
    null
  ); //your own client_email and private_key has to be created

  await sheets.spreadsheets.create(
    {
      auth: auth,
      resource: {
        properties: {
          title: "query result",
        },
      },
    },
    async (err, response) => {
      if (err) {
        console.log(`Error: ${err}`);
        return;
      }
      var fileId = response.data.spreadsheetId;
      var permissions = [
        {
          type: "user",
          role: "writer", //type of permission
          emailAddress: "abc@gmail.com", // enter the email who you want to give permission
        },
        //for domain
        // {
        //   type: "domain",
        //   role: "writer",
        //   domain: "abc.com",
        // },
      ];
      const drive = google.drive({ version: "v3", auth: auth });

      async.eachSeries(
        permissions,
        function (permission, permissionCallback) {
          drive.permissions.create(
            {
              resource: permission,
              fileId: fileId,
              fields: "id",
            },
            function (err, res) {
              if (err) {
                console.error(err);
                permissionCallback(err);
              } else {
                permissionCallback();
              }
            }
          );
        },
        async (err) => {
          if (err) {
            console.error(err);
          } else {
            const doc = new GoogleSpreadsheet(fileId);
            await doc.useServiceAccountAuth({
              client_email: process.env.CLIENT_EMAIL,
              private_key: process.env.PRIVATE_KEY,
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            sheet.headerValues = header;
            await sheet.addRows(Data);
            const rows = await sheet.getRows();
            console.log(rows);
            const finalspreadsheetlink =
              "https://docs.google.com/spreadsheets/d/" + fileId;
            res.send({ spreadsheetid: finalspreadsheetlink }); //you can access the sheet from this link
          }
        }
      );
    }
  );
});

module.exports = router;
