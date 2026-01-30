// module.exports = {
//   ROLES: {
//     STUDENT: 'student',
//     ADMIN: 'admin'
//   },
  
//   APPLICATION_STATUS: {
//     PENDING: 'pending',
//     APPROVED: 'approved',
//     REJECTED: 'rejected'
//   },
  
//   COURSES: [
//     'Computer Science',
//     'Electronics & Communication',
//     'Mechanical Engineering',
//     'Civil Engineering',
//     'Electrical Engineering',
//     'Information Technology',
//     'Business Administration',
//     'Commerce',
//     'Arts'
//   ],
  
//   DOCUMENT_TYPES: {
//     PROFILE_PHOTO: 'profile_photo',
//     MARKSHEET_10TH: 'marksheet_10th',
//     MARKSHEET_12TH: 'marksheet_12th',
//     ID_PROOF: 'id_proof',
//     TRANSFER_CERTIFICATE: 'transfer_certificate',
//     CAST_CERTIFICATE: 'cast_certificate',
//     OTHER: 'other'
//   },
  
//   MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
//   ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
// };

const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const COURSES = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Business Administration',
  'Commerce',
  'Arts'
];

const DOCUMENT_TYPES = {
  PROFILE_PHOTO: 'profile_photo',
  MARKSHEET_10TH: 'marksheet_10th',
  MARKSHEET_12TH: 'marksheet_12th',
  ID_PROOF: 'id_proof',
  TRANSFER_CERTIFICATE: 'transfer_certificate',
  CAST_CERTIFICATE: 'cast_certificate',
  OTHER: 'other'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf'
];

module.exports = {
  ROLES,
  APPLICATION_STATUS,
  COURSES,
  DOCUMENT_TYPES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES
};
