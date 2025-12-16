export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------------- AUTH ROUTES ----------------
export const AUTH_API = {
REGISTER: `${API_BASE_URL}/auth/add-user`,
LOGIN: `${API_BASE_URL}/auth/login`,
UPDATE_USER: `${API_BASE_URL}/auth/update-user`,
PROFILE: `${API_BASE_URL}/auth/profile`,
};

// ---------------- ADMIN ROUTES ----------------
export const ADMIN_API = {
ALL_USERS: `${API_BASE_URL}/admin/all-user`,
SINGLE_USER: `${API_BASE_URL}/admin/single-user`,
DELETE_REACTIVATE_USER: `${API_BASE_URL}/admin/delete-reactive-user`,

ALL_COURSES: `${API_BASE_URL}/admin/all-course`,
SINGLE_COURSE: `${API_BASE_URL}/admin/single-course`,
TOGGLE_COURSE_STATUS: `${API_BASE_URL}/admin/toggle-course-status`,
DELETE_REACTIVATE_COURSE: `${API_BASE_URL}/admin/delete-reactive-course`,

ALL_LECTURES: `${API_BASE_URL}/admin/all-lecture`,
SINGLE_LECTURE: `${API_BASE_URL}/admin/single-lecture`,
DELETE_REACTIVATE_LECTURE: `${API_BASE_URL}/admin/delete-reactive-lecture`,
};

// ---------------- INSTRUCTOR ROUTES ----------------
export const INSTRUCTOR_API = {
ALL_COURSES: `${API_BASE_URL}/instructor/all-course`,
TOP_RATED: `${API_BASE_URL}/instructor/top-rated-course`,
SINGLE_COURSE: `${API_BASE_URL}/instructor/single-course`,
ADD_COURSE: `${API_BASE_URL}/instructor/add-course`,
UPDATE_COURSE: `${API_BASE_URL}/instructor/update-course`,
DELETE_COURSE: `${API_BASE_URL}/instructor/delete-course`,

ALL_LECTURES: `${API_BASE_URL}/instructor/all-lecture`,
SINGLE_LECTURE: `${API_BASE_URL}/instructor/single-lecture`,
ADD_LECTURE: `${API_BASE_URL}/instructor/add-lecture`,
UPDATE_LECTURE: `${API_BASE_URL}/instructor/update-lecture`,
DELETE_LECTURE: `${API_BASE_URL}/instructor/delete-lecture`,

ENROLLED_STUDENTS: `${API_BASE_URL}/instructor/enrolled-students`,
AVG_RATING: `${API_BASE_URL}/instructor/avarge-rating`,
EARNINGS: `${API_BASE_URL}/instructor/total-earning`,
};

// ---------------- STUDENT ROUTES ----------------
export const STUDENT_API = {
ALL_COURSE: `${API_BASE_URL}/student/`,
ANY_COURSE: `${API_BASE_URL}/student/any-course`,
SINGLE_COURSE: `${API_BASE_URL}/student/single-course`,
FREE_ENROLL: `${API_BASE_URL}/student/free-enroll`,
PAID_ENROLL: `${API_BASE_URL}/student/paid-enroll`,
ENROLLED_COURSES: `${API_BASE_URL}/student/enrolled-course`,
VIEW_LECTURE: `${API_BASE_URL}/student/view-lecture`,
ADD_REVIEW: `${API_BASE_URL}/student/add-review`,
SINGLE_LECTURE: `${API_BASE_URL}/student/single-lecture`,
COMPLETED_LECTURE: `${API_BASE_URL}/student/completed-lecture`,
};

// ---------------- PAYMENT ROUTES ----------------
export const PAYMENT_API = {
CHECKOUT_SESSION: `${API_BASE_URL}/payment/create-checkout-session`,
};



// -----------------IMAGE BASE URL ----------------
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_FETCH_DATA_URL;