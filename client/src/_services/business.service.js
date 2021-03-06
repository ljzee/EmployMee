import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import {authenticationService} from './authentication.service';

import axios from 'axios';

export const businessService = {
    createProfile,
    getProfile,
    addJobPost,
    getAllBusinessJobPost,
    getJobPost,
    updateJobPost,
    updateJobPostStatus,
    deleteJobPost,
    getJobApplicants,
    getApplicantFiles,
    updateApplicationStatus,
    updateJobPostStatus,
    updateJobPostDeadline,
    uploadProfileImage,
    updateProfile,
    addUpdate,
    deleteUpdate,
    getDashboard
};

function createProfile(companyName, country, state, city, streetAddress, postalCode, phoneNumber, website, description) {
  const configOptions = {
      headers: authHeader()
  };

  return axios.post(`${config.apiUrl}/business/profile`, {
        'companyName' : companyName,
        'country': country,
        'state': state,
        'city': city,
        'streetAddress': streetAddress,
        'phoneNumber': phoneNumber,
        'website': website,
        'description': description,
        'postalCode': postalCode
      }, configOptions)
      .then(response => {
        let currentUser = authenticationService.currentUserValue;
        currentUser.hasProfile = true;
        authenticationService.newCurrentUserValue = currentUser;

      })
      .catch((error)=>Promise.reject(error.response.data.errors));
}

function getProfile(userId){
  return axios.get(`${config.apiUrl}/business/profile/${userId}`, {})
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))

}

function addJobPost(jobTitle, duration, positionType, location, openings, jobDescription, salary, deadline, resumeRequired, coverletterRequired, otherRequired, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/jobpost`, {jobTitle: jobTitle, duration: duration, positionType: positionType, location: location, openings: openings, jobDescription: jobDescription, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired, status: status}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function getAllBusinessJobPost(){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function getJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function updateJobPost(jobPostId, jobTitle, duration, positionType, location, openings, jobDescription, salary, deadline, resumeRequired, coverletterRequired, otherRequired){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}`, {jobTitle: jobTitle, duration: duration, positionType: positionType, location: location, openings: openings, jobDescription: jobDescription, salary: salary, deadline: deadline, resumeRequired: resumeRequired, coverletterRequired: coverletterRequired, otherRequired: otherRequired}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function updateJobPostStatus(jobPostId, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}/status`, {status: status}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function updateJobPostDeadline(jobPostId, deadline){
  const configOptions = {
      headers: authHeader()
  };
  return axios.put(`${config.apiUrl}/business/jobpost/${jobPostId}/deadline`, {deadline: deadline}, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function deleteJobPost(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/business/jobpost/${jobPostId}`, configOptions)
              .catch((error) => Promise.reject(error.response.data.errors))
}


function getJobApplicants(jobPostId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}/applicants`, configOptions)
              .then(result => result.data)
              .catch((error) => Promise.reject(error.response.data.errors))
}

function getApplicantFiles(jobPostId, applicantId){
  const configOptions = {
      headers: authHeader(),
      responseType: 'blob'
  };
  return axios.get(`${config.apiUrl}/business/jobpost/${jobPostId}/applicants/${applicantId}`, configOptions)
              .then(res=>(res))
              .catch((error) => Promise.reject(error));

}

function updateApplicationStatus(jobPostId, applicantId, status){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/jobpost/${jobPostId}/applicants/${applicantId}`, {status: status}, configOptions)
              .catch((error) => Promise.reject(error));
}

function uploadProfileImage(encodedString){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/profile/profile-image`, {encodedString: encodedString}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function updateProfile(phoneNumber, website, description){
  const user = authenticationService.currentUserValue;
  const configOptions = {
      headers: authHeader()
  };

  return axios.put(`${config.apiUrl}/business/profile/${user.id}`, {phoneNumber: phoneNumber, website: website, description: description}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function addUpdate(content){
  const configOptions = {
      headers: authHeader()
  };
  return axios.post(`${config.apiUrl}/business/updates`, {content: content}, configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}

function deleteUpdate(updateId){
  const configOptions = {
      headers: authHeader()
  };
  return axios.delete(`${config.apiUrl}/business/updates/${updateId}`,configOptions)
              .catch((error)=>Promise.reject(error.response.data.errors));
}


function getDashboard(){
  const configOptions = {
      headers: authHeader()
  };

  return axios.get(`${config.apiUrl}/business/dashboard`, configOptions)
              .then(result => result.data)
              .catch((error)=>Promise.reject(error.response.data.errors));
}
