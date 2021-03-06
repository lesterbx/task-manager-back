module.exports = [
  {
    "section": "httpd",
    "key": "enable_cors",
    "value": true
  },
  {
    "section": "cors",
    "key": "origins",
    "value": "*"
  },
  {
    "section": "couch_httpd_auth",
    "key": "users_db_public",
    "value": true
  },
  {
    "section": "couch_httpd_auth",
    "key": "public_fields",
    "value": "firstName, lastName, name"
  },
  {
    "section": "couch_httpd_auth",
    "key": "allow_persistent_cookies",
    "value": "true"
  },
  {
    "section": "couch_httpd_auth",
    "key": "timeout",
    "value": "86400"
  }
]