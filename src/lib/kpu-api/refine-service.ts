import type { Service } from "./types";

const defaultDescription =
  "Provides a wide range of resources and services to support various needs.";
const defaultImage = "/service-images/kpu.png";

const refinedServices: Record<string, Partial<Service>> = {
  "course-websites": {
    title: "Courses Website",
    description:
      "Moodle is a learning management platform for instructors and students.",
    image: "/service-images/courses-website.png",
  },
  library: {
    title: "Library",
    description:
      "Access to books, articles, journals and other library services.",
    image: "/service-images/library.png",
  },
  "new-employee-webmail1": {
    title: "Employee Email",
    description:
      "Employee’s personal email to communicate with students and faculty.",
    image: "/service-images/employee-email.png",
  },
  newstudentemail2: {
    description:
      "Your personal email to communicate and collaborate between students and faculty.",
    image: "/service-images/student-email.png",
  },
  myactionplan: {
    description:
      "MAP is a tool for students to track completion of program requirements and map their route to graduation.",
    image: "/service-images/my-action-plan.png",
  },
  "employee-dashboard": {
    image: "/service-images/employee-dashboard.png",
  },
  "register-for-classes": {
    description:
      "Manage your course registration, check registration history, and plan your future courses.",
    image: "/service-images/register.png",
  },
  "make-non-urgent-maintenance-request": {
    image: "/service-images/maintenance.png",
  },
  banner9: {
    description:
      "Efficiently manage your academic and administrative needs with Banner 9.",
    image: "/service-images/banner-navigator.png",
  },
  oss: {
    description:
      "Platform where students can register for classes, pay tuition fees, update personal information, check or post grades, etc.",
    image: "/service-images/self-service.png",
  },
  upass: {
    description:
      "Provides access to U-pass BC, campus-to-campus shuttle program, discounted fitness center passes, car sharing program, bicycle lockers",
    image: "/service-images/upass.png",
  },
  papercut: {
    image: "/service-images/papercut.png",
  },
  onedrive: {
    description:
      "OneDrive is a cloud-based storage for Employees and Students.",
    image: "/service-images/onedrive.png",
  },
  "taleo-recruit": {
    image: "/service-images/taleo.png",
  },
  "student-profile": {
    description:
      "Access to student’s personal information, academic history and standing, credits, GPA, and registration notices.",
    image: "/service-images/student-profile.png",
  },
  "first-aid": {
    image: "/service-images/aid.png",
  },
  5688: {
    image: "/service-images/kpq.png",
  }, // wtf?
  "rights-responsibilities": {
    image: "/service-images/rights.png",
  },
  printing: {
    description:
      "Provides information how, where, and for what price you can print.",
    image: "/service-images/printing.png",
  },
  6277: {
    image: "/service-images/compass.png",
  }, // removed?
  "costs-international": {
    image: "/service-images/fees-and-costs.png",
  },
  "book-study-rooms": {
    description:
      "Easily book study rooms for a focused and quiet study environment.",
    image: "/service-images/book-room.png",
  },
  "registration-dates-deadlines": {
    description:
      "Check key academic dates, including registration, exams, and holidays.",
    image: "/service-images/deadlines.png",
  },
  "academic-schedule": {
    image: "/service-images/schedule.png",
  },
  servicedesk: {
    image: "/service-images/it-support.png",
  },
  "social-media-directory": {
    image: "/service-images/social-media.png",
  },
  food: {
    image: "/service-images/food.png",
  },
  "pay-reg-fees-and-tuition": {
    description: "Here you can pay your tuition and outstanding fees.",
    image: "/service-images/pay.png",
  },
  "advisor-student-profile": {
    image: "/service-images/advisor-student-profile.png",
  },
  fast: {
    title: "Sign in to FAST",
    image: "/service-images/fast.png",
  },
  "study-abroad-scholarships": {
    image: "/service-images/study-abroad.png",
  },
  zoom: {
    image: "/service-images/zoom.png",
  },
  "my-library-account": {
    image: "/service-images/library-account.png",
  },
  "library-services": {
    image: "/service-images/library-services.png",
  },
  "research-services": {
    image: "/service-images/research.png",
  },
  "research-guides": {
    image: "/service-images/research.png",
  },
  "search-summon": {
    image: "/service-images/research.png",
  },
  "acessing-databases": {
    image: "/service-images/research.png",
  },
  "library-hours": {
    image: "/service-images/hours.png",
  },
  plagiarism: {
    image: "/service-images/plagiarism.png",
  },
  shuttle: {
    image: "/service-images/shuttle.png",
  },
  "kpu-card": {
    image: "/service-images/id-card.png",
  },
  bbb: {
    image: "/service-images/big-blue-button.png",
  },
  grades: {
    description:
      "Easily access your grades and monitor your academic performance.",
    image: "/service-images/check-grades.png",
  },
  "fsh-website": {
    image: "/service-images/science-and-horticulture.png",
  },
  "marketing-services-request": {
    image: "/service-images/marketing.png",
  },
  virtualintern: {
    image: "/service-images/virtual-internships.png",
  },
  "submit-sin": {
    description:
      "Accessed by students to submit their Social Insurance Number (SIN)",
    image: "/service-images/submit-sin.png",
  },
  "book-advising-appointment": {
    image: "/service-images/advising.png",
  },
  "academic-advising": {
    image: "/service-images/advising.png",
  },
  centraladvising: {
    image: "/service-images/advising.png",
  },
  "business-degree-advising": {
    image: "/service-images/advising.png",
  },
  "arts-degree-advising": {
    image: "/service-images/advising.png",
  },
  "outgoing-exchange-partner": {
    image: "/service-images/study-abroad.png",
  },
  "study-abroad-application": {
    image: "/service-images/study-abroad.png",
  },
  "international-contact-list": {
    image: "/service-images/study-abroad.png",
  },
  "campus-maps": {
    image: "/service-images/maps.png",
  },
  "marketing-resources": {
    image: "/service-images/marketing-resources.png",
  },
  "health-plans": {
    description:
      "Find more about KPU's Temporary Medical Insurance Plan, KSA Extended Health, Dental and BC Medical Services Plan (BCMSP).",
    image: "/service-images/insurance.png",
  },
  "university-calendar": {
    image: "/service-images/university-calendar.png",
  },
  "arts-programs": {
    title: "Art Programs",
    image: "/service-images/arts.png",
  },
  myssp: {
    image: "/service-images/my-ssp.png",
  },
  "order-transcript": {
    description:
      "Provides details of process for ordering official transcripts from KPU, including requirements, delivery options, costs, and processing times.",
    image: "/service-images/transcript.png",
  },
  transcript: {
    image: "/service-images/transcript.png",
  },
  "transfer-credit-request": {
    image: "/service-images/transfer.png",
  },
  "after-credit-transfer": {
    image: "/service-images/transfer.png",
  },
  "transfer-credit": {
    image: "/service-images/transfer.png",
  },
  "view-transfer-credit": {
    image: "/service-images/transfer.png",
  },
  "unofficial-transcript": {
    image: "/service-images/view-transcript.png",
  },
  "office-of-the-registrar": {
    description:
      "Get help with admissions, registration, records, and graduation.",
    image: "/service-images/office.png",
  },
  "kpu-directory-search": {
    image: "/service-images/directory-search.png",
  },
  payroll: {
    image: "/service-images/payroll.png",
  },
  "finance-forms": {
    image: "/service-images/payroll.png",
  },
  "kpu-tech-programs": {
    image: "/service-images/tech.png",
  },
  "kpu-tech-how-to-apply": {
    image: "/service-images/tech.png",
  },
  6232: {
    image: "/service-images/tech.png",
  },
  "course-websites-051642": {
    title: "Courses Website - Community",
    image: "/service-images/moodle-community.png",
  },
  "course-websites-tradescps": {
    title: "Courses Website (Old)",
    image: "/service-images/moodle-community.png",
  },
  pebblepad: {
    description:
      "PebblePad. This versatile platform provides a range of resources to support your academic journey, allowing you to create, share, and reflect on your work.",
    image: "/service-images/pebblepad.png",
  },
  "wsd-events": {
    description:
      "Explore innovative design programs and resources at the Wilson School of Design.",
    image: "/service-images/wilson.png",
  },
  instagram: {
    image: "/service-images/instagram.png",
  },
  twitter: {
    title: "KPU X",
    image: "/service-images/x.png",
  },
  facebook: {
    image: "/service-images/facebook.png",
  },
  feedback: {
    image: "/service-images/feedback.png",
  },
  kfa: {
    image: "/service-images/kwantlen-faculty-association.png",
  },
  "submit-a-key-request": {
    image: "/service-images/submit-key.png",
  },
  kaltura: {
    image: "/service-images/kaltura.png",
  },
  "co-op": {
    image: "/service-images/coop.png",
  },
  ssd: {
    image: "/service-images/accessibility.png",
  },
  "adobe-creative-cloud-consent": {
    image: "/service-images/creative-cloud.png",
  },
  "student-sspr-forgot-password": {
    image: "/service-images/student-password.png",
  },
  "student-sspr-change-password": {
    image: "/service-images/student-password.png",
  },
  "student-sspr-registration": {
    image: "/service-images/student-password.png",
  },
  "sspr-forgot": {
    image: "/service-images/employee-password.png",
  },
  "employee-sspr-change-password": {
    image: "/service-images/employee-password.png",
  },
  "employee-sspr-registration": {
    image: "/service-images/employee-password.png",
  },
  "course-websites-051917": {
    image: "/service-images/moodle-community.png",
  },
  classfeedback2: {
    image: "/service-images/course-feedback.png",
  },
  cimfeedbackform: {
    image: "/service-images/cim.png",
  },
  cimapprovalqueue: {
    image: "/service-images/cim.png",
  },
  cimprograms: {
    image: "/service-images/cim.png",
  },
  courseleaf: {
    image: "/service-images/cim.png",
  },
  "admissions-guide": {
    image: "/service-images/admission.png",
  },
  convocation: {
    image: "/service-images/convocation.png",
  },
  "media-space": {
    image: "/service-images/kaltura-video.png",
  },
  bcgeu: {
    image: "/service-images/bcgeu.png",
  },
  bookstore: {
    image: "/service-images/store.png",
  },
  "advisor-connect": {
    image: "/service-images/study-abroad.png",
  },
  "current-balance": {
    image: "/service-images/current-balance.png",
  },
  "concord-students": {
    image: "/service-images/concord.png",
    description: "Access to Concord, KPU's Staff & Faculty Parking Permits.",
  },
  "concord-employees": {
    image: "/service-images/concord.png",
    description: "Access to Concord, KPU's Student & Visitor Parking Permits.",
  },
  security: {
    image: "/service-images/security.png",
  },
  "study-work-permit": {
    image: "/service-images/immigration.png",
  },
  "international-orientation": {
    image: "/service-images/immigration.png",
  },
  "plan-courses": {
    image: "/service-images/plan-courses.png",
  },
  ksa: {
    image: "/service-images/ksa.png",
  },
  "online-registration-guide": {
    title: "Registration Guide",
    image: "/service-images/registration-guide.png",
  },
  "room-space-booking": {
    image: "/service-images/book-space.png",
  },
  "fsh-programs": {
    image: "/service-images/science-and-horticulture.png",
  },
  "fsh-advising": {
    image: "/service-images/science-and-horticulture.png",
  },
  "int-academic": {
    image: "/service-images/study-abroad.png",
  },
  "int-non-academic": {
    image: "/service-images/study-abroad.png",
  },
  "after-applying": {
    image: "/service-images/what.png",
  },
  "bylaws-and-policies": {
    image: "/service-images/bylaws.png",
  },
};

export function refineService(service: Omit<Service, "description">): Service {
  const refinedService = refinedServices[service.uniqueKey];
  if (refinedService)
    return { ...service, description: defaultDescription, ...refinedService };
  return {
    ...service,
    image: defaultImage,
    description: defaultDescription,
  };
}
