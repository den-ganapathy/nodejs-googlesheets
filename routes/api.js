const express = require("express");
const router = express.Router();
const fs = require("fs");
const axios = require("axios");
var _ = require("lodash");
const { add } = require("lodash");
const { google } = require("googleapis");
const sheets = google.sheets("v4");
const async = require("async");
const { GoogleSpreadsheet } = require("google-spreadsheet");

router.get("/transferId", async (req, res) => {
  const queryData = [
    { name: "den", id: 123 },
    { name: "gana", id: 456 },
  ];

  if (!queryData) {
    return;
  }
  let [value] = queryData;
  let header = Object.keys(value);
  console.log(value, header);

  const auth = new google.auth.JWT(
    "acc1-178@proj1-294109.iam.gserviceaccount.com",
    null,
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDKBx5rsjw4yhxM\nTZySiRMtK/dszRaN6X1lyMIOb8bxuCEoIqtFkvMgF6ESgqCnZrpxVxqICtq6Vcsr\nh1yqBSFtH6cxAJwj3rdj7h20XguNk8UdG9KBME5lN7AdWJ4DFLfGs39wZRS3usaM\nFHrUxBLZAJA6dPNwAGkfc1Sjca6JKaAEGjX8V4avaT0VAYmEcRyHERX1XRjttueI\ne8/a+f8KVtHVob9Y1CCSqN2IZ5veC2GpVelrPnWacEVQdPS931munYdTpgP2Wht8\na24RI+U9NaB0uc0fgLTT30Alm5ACA7VSm+asLaI/zLqpjfahN9lMSm5cbkJ9ENN/\nXGScIr87AgMBAAECggEAJ+5fR2cbuxfLnxNKCraYOTny9ijVN+h6Fhenr4XNWzKL\nLy0nECHa9zFkb02tZlkKKePPBSusDt9tQGXJXXuVH0X93FQkCHz5X4GNknxyKSIX\neEjrAwjivePTZgGBfddm+Zm56yO3hBchLkfP/WTh2s1fNIawJSeXn5VCmema11Yu\nXL7X+u0o0PJ1sdKDqC/KHbLo8zFrg1P8kj+3QsDwe/JNHtghNdBkQUKPBgxZpuqo\nN7UaXyR3uuBnBgYhrLpgVl/8jMsV7Am4jKFTiUY8V15P1xmdxv7rByYsR1fkgwoW\nPmsXww9ZDmud9wNMPFJ/vW490ouQpJ2NC8ym5pCR7QKBgQDvE0iFhKamLo+MKUAD\nprpz+RE46sNF8Atd37YLP7lr2DBm+6BtJfi0eT56j1qToB2BhoBimmfYOgIZuv7B\nowN0pk96vWm9D05nftjdYAEhykfyi2gKgvAYAeix3poLXHsNWyP4V5BzFeQKH+nS\n4GMdQOtOgUlyx2G7D02Q0L8ADQKBgQDYVG4wJBxGMRTZTRCYVysG37L+CKCMpkSp\n1rIxSy2yVbK0JlCmEGX4KqIBA/Pjw5cS499qm++birNm6e+CyD+lqEy5/ePDnU6g\n9jGJFMkMC9dzpFZlpOu4M1JRGcZhV2OTPDUZTVlTX8UCgIuFGnioUoTMLweyXjMA\nGkDBLGgiZwKBgC8OCZEV+cLtmR1KJSpSz5Hx7LzaIBMM2v/f/zGZmkIqq+QpFHtH\nJPtIfc6bloVF12jd8zj1EQlS6YTs9CVik1SLQ0tyKnSmpZTjN4Xi1nYzHRQU8iZX\nfTAMeCNCH+mqiyGm1Z6UhX7RSS/g9iGmPnvMgkPSWIV5zreFnIurOlylAoGAbK52\nMS9jGQx9efJSnQZl8m0eQqvY5PB/XIglO8iWK5sMTZ9WMyfX4sagXzw6IjpYQsBC\ntQ+kYBNdsB1lG+I4v6P+8A4SiGsWXp1xI3pSyv+D/XAZi7VAS2lVOLNnS+4Yc5by\n4kRO1SkvE+O6tGMpLP9QAji6eC0FGE8YKzSBGI8CgYBj8jeCSZGPIXFZi8uwNSvj\nd8n3gWeh+LtXgfHXrDgY2oJ13hVKKjZcBceGtoM7i7gYVavwisV9gvHG3J4YAE9a\nLmXaonb+FdssCmshIq/C34sadNiDv5aYJnLf4w6zrYPPmIhq3qPwJvRRUmlOyZ5H\nQTgpZOclW/EoaZQfITKt8Q==\n-----END PRIVATE KEY-----\n",
    [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
    null
  );

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
      console.log(response.data.spreadsheetId);

      var fileId = response.data.spreadsheetId;
      var permissions = [
        {
          type: "user",
          role: "writer",
          emailAddress: "karthik@classplus.co",
        },
        {
          type: "domain",
          role: "writer",
          domain: "classplus.co",
        },
      ];
      const drive = google.drive({ version: "v3", auth: auth });

      await async.eachSeries(
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
                console.log("Permission ID: ", res.id);
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
            console.log(doc);

            await doc.useServiceAccountAuth({
              client_email: "acc1-178@proj1-294109.iam.gserviceaccount.com",
              private_key:
                "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDKBx5rsjw4yhxM\nTZySiRMtK/dszRaN6X1lyMIOb8bxuCEoIqtFkvMgF6ESgqCnZrpxVxqICtq6Vcsr\nh1yqBSFtH6cxAJwj3rdj7h20XguNk8UdG9KBME5lN7AdWJ4DFLfGs39wZRS3usaM\nFHrUxBLZAJA6dPNwAGkfc1Sjca6JKaAEGjX8V4avaT0VAYmEcRyHERX1XRjttueI\ne8/a+f8KVtHVob9Y1CCSqN2IZ5veC2GpVelrPnWacEVQdPS931munYdTpgP2Wht8\na24RI+U9NaB0uc0fgLTT30Alm5ACA7VSm+asLaI/zLqpjfahN9lMSm5cbkJ9ENN/\nXGScIr87AgMBAAECggEAJ+5fR2cbuxfLnxNKCraYOTny9ijVN+h6Fhenr4XNWzKL\nLy0nECHa9zFkb02tZlkKKePPBSusDt9tQGXJXXuVH0X93FQkCHz5X4GNknxyKSIX\neEjrAwjivePTZgGBfddm+Zm56yO3hBchLkfP/WTh2s1fNIawJSeXn5VCmema11Yu\nXL7X+u0o0PJ1sdKDqC/KHbLo8zFrg1P8kj+3QsDwe/JNHtghNdBkQUKPBgxZpuqo\nN7UaXyR3uuBnBgYhrLpgVl/8jMsV7Am4jKFTiUY8V15P1xmdxv7rByYsR1fkgwoW\nPmsXww9ZDmud9wNMPFJ/vW490ouQpJ2NC8ym5pCR7QKBgQDvE0iFhKamLo+MKUAD\nprpz+RE46sNF8Atd37YLP7lr2DBm+6BtJfi0eT56j1qToB2BhoBimmfYOgIZuv7B\nowN0pk96vWm9D05nftjdYAEhykfyi2gKgvAYAeix3poLXHsNWyP4V5BzFeQKH+nS\n4GMdQOtOgUlyx2G7D02Q0L8ADQKBgQDYVG4wJBxGMRTZTRCYVysG37L+CKCMpkSp\n1rIxSy2yVbK0JlCmEGX4KqIBA/Pjw5cS499qm++birNm6e+CyD+lqEy5/ePDnU6g\n9jGJFMkMC9dzpFZlpOu4M1JRGcZhV2OTPDUZTVlTX8UCgIuFGnioUoTMLweyXjMA\nGkDBLGgiZwKBgC8OCZEV+cLtmR1KJSpSz5Hx7LzaIBMM2v/f/zGZmkIqq+QpFHtH\nJPtIfc6bloVF12jd8zj1EQlS6YTs9CVik1SLQ0tyKnSmpZTjN4Xi1nYzHRQU8iZX\nfTAMeCNCH+mqiyGm1Z6UhX7RSS/g9iGmPnvMgkPSWIV5zreFnIurOlylAoGAbK52\nMS9jGQx9efJSnQZl8m0eQqvY5PB/XIglO8iWK5sMTZ9WMyfX4sagXzw6IjpYQsBC\ntQ+kYBNdsB1lG+I4v6P+8A4SiGsWXp1xI3pSyv+D/XAZi7VAS2lVOLNnS+4Yc5by\n4kRO1SkvE+O6tGMpLP9QAji6eC0FGE8YKzSBGI8CgYBj8jeCSZGPIXFZi8uwNSvj\nd8n3gWeh+LtXgfHXrDgY2oJ13hVKKjZcBceGtoM7i7gYVavwisV9gvHG3J4YAE9a\nLmXaonb+FdssCmshIq/C34sadNiDv5aYJnLf4w6zrYPPmIhq3qPwJvRRUmlOyZ5H\nQTgpZOclW/EoaZQfITKt8Q==\n-----END PRIVATE KEY-----\n",
            });
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            sheet.headerValues = header;
            await sheet.addRows(queryData);
            const rows = await sheet.getRows();
            console.log(rows);
            return rows;
          }
        }
      );
    }
  );
});

module.exports = router;
