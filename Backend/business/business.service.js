const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
var pool = require('../database');
const bcrypt = require('bcrypt');


module.exports = {
    getBusinessProfile,
    addBusinessProfile,
};

async function getBusinessProfile({id}){
  //console.log(id)
  let profileResults, addressesResults;
  try{
    profileResults = await pool.query('SELECT email, business_profile.* FROM business_profile, users WHERE business_profile.id = users.id AND business_profile.id = $1', [id]);
    addressesResults = await pool.query('SELECT addresses.* FROM business_profile, business_addresses, addresses WHERE business_profile.id = $1 AND business_profile.id = business_addresses.b_id AND business_addresses.a_id = addresses.id', [id])
  }catch(error){
    throw error;
  }

  if(profileResults.rowCount){
    profileResults.rows[0].addresses = addressesResults.rows;
    return profileResults.rows[0];
  }
  return null;
}

async function addBusinessProfile(id, {companyName, country, state, city, streetAddress, postalCode, phoneNumber, website, description}){
  let businessQueryResults, addressQueryResults;
  try{
    businessQueryResults = await pool.query('INSERT INTO business_profile(id, company_name, description, website, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id', [id, companyName, description, website, phoneNumber]);
    addressQueryResults = await pool.query('INSERT INTO addresses(id, street_name_no, city, state, country, postal_code) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING id', [streetAddress, city, state, country, postalCode]);
    if(businessQueryResults.rows.length && addressQueryResults.rows.length){
      await pool.query('INSERT INTO business_addresses(b_id, a_id) VALUES ($1, $2)', [businessQueryResults.rows[0].id, addressQueryResults.rows[0].id])
    }

  }catch(error){
    throw error;
  }
}