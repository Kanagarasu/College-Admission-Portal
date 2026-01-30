export const COURSES = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Business Administration',
  'Commerce',
  'Arts'
]

export const BOARDS = [
  'CBSE',
  'ICSE',
  'State Board',
  'IGCSE',
  'Other'
]

export const CATEGORIES = [
  'General',
  'OBC',
  'SC',
  'ST',
  'Other'
]

export const ENTRANCE_EXAMS = [
  'JEE Main',
  'JEE Advanced',
  'NEET',
  'State CET',
  'Other'
]

export const DOCUMENT_TYPES = [
  { id: 'profile_photo', name: 'Profile Photo', required: true },
  { id: 'marksheet_10th', name: '10th Marksheet', required: true },
  { id: 'marksheet_12th', name: '12th Marksheet', required: true },
  { id: 'id_proof', name: 'ID Proof', required: true },
  { id: 'transfer_certificate', name: 'Transfer Certificate', required: false },
  { id: 'cast_certificate', name: 'Caste Certificate', required: false },
  { id: 'other', name: 'Other Documents', required: false }
]

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
}