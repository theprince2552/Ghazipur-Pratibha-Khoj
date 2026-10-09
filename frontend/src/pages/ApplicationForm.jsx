import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


function ApplicationForm() {

  const navigate = useNavigate();

  const { user } = useAuth();


  const [loading, setLoading] = useState(false);
  const [centersLoading, setCentersLoading] = useState(true);

  const [centers, setCenters] = useState([]);

  const [applicationId, setApplicationId] = useState(null);


  const [formData, setFormData] = useState({

    student_full_name: user?.full_name || "",

    father_name: "",
    mother_name: "",

    aadhar_number: "",

    gender: "",

    mobile_number: user?.mobile || "",

    student_class: "",

    school_name: "",

    board: "",

    village: "",
    post: "",
    pin_code: "",
    district: "",
    state: "",

    exam_center: "",

  });


  // ==========================================
  // FETCH EXAM CENTERS
  // ==========================================

  useEffect(() => {

    const fetchCenters = async () => {

      try {

        setCentersLoading(true);

        const response = await api.get(
          "/exams/centers/"
        );

        const data =
          response.data?.data ||
          response.data ||
          [];

        // Sirf active + available centers
        const availableCenters =
          data.filter(
            (center) =>
              center.is_active &&
              center.available_seats > 0
          );

        setCenters(availableCenters);

      } catch (error) {

        console.error(error);

        toast.error(
          "Unable to load exam centers."
        );

      } finally {

        setCentersLoading(false);

      }

    };


    fetchCenters();

  }, []);
  // ==========================================
  // FETCH EXISTING APPLICATION / DRAFT
  // ==========================================

  useEffect(() => {

    const fetchApplication = async () => {

      try {

        const response = await api.get(
          "/exams/application/"
        );

        const application =
          response.data?.data;

        // Agar application abhi bani hi nahi hai
        if (!application) {
          return;
        }

        // Application ID save karo
        setApplicationId(application.id);

        // Database ka data form me bhar do
        setFormData({

          student_full_name:
            application.student_full_name || "",

          father_name:
            application.father_name || "",

          mother_name:
            application.mother_name || "",

          aadhar_number:
            application.aadhar_number || "",

          gender:
            application.gender || "",

          mobile_number:
            application.mobile_number ||
            user?.mobile ||
            "",

          student_class:
            application.student_class || "",

          school_name:
            application.school_name || "",

          board:
            application.board || "",

          village:
            application.village || "",

          post:
            application.post || "",

          pin_code:
            application.pin_code || "",

          district:
            application.district || "",

          state:
            application.state || "",

          exam_center:
            application.exam_center
              ? String(application.exam_center)
              : "",

        });

      } catch (error) {

        console.error(
          "Unable to load application:",
          error
        );

      }

    };


    if (user) {
      fetchApplication();
    }

  }, [user]);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // ==========================================
  // SAVE DRAFT
  // ==========================================

  const handleSaveDraft = async () => {

    try {

      setLoading(true);

      const payload = {
        ...formData,
        exam_center: formData.exam_center
          ? Number(formData.exam_center)
          : null,
      };

      const response = await api.post(
        "/exams/application/",
        payload
      );

      const data =
        response.data?.data ||
        response.data;

      if (data?.id) {
        setApplicationId(data.id);
      }

      toast.success(
        "Application saved as draft."
      );

    } catch (error) {

      console.error(error);

      const errors =
        error.response?.data?.errors;

      if (errors) {

        const firstError =
          Object.values(errors)[0];

        toast.error(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );

      } else {

        toast.error(
          error.response?.data?.message ||
          "Unable to save draft."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // ==========================================
  // SUBMIT APPLICATION
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!formData.student_full_name) {
      toast.error("Please enter student name.");
      return;
    }

    if (!formData.father_name) {
      toast.error("Please enter father's name.");
      return;
    }

    if (!formData.mother_name) {
      toast.error("Please enter mother's name.");
      return;
    }

    if (!formData.aadhar_number) {
      toast.error(
        "Please enter Aadhaar / ID number."
      );
      return;
    }

    if (!formData.gender) {
      toast.error("Please select gender.");
      return;
    }

    if (!formData.student_class) {
      toast.error("Please enter class.");
      return;
    }

    if (!formData.school_name) {
      toast.error("Please enter school name.");
      return;
    }

    if (!formData.board) {
      toast.error("Please select board.");
      return;
    }

    if (!formData.village) {
      toast.error("Please enter village.");
      return;
    }

    if (!formData.post) {
      toast.error("Please enter post.");
      return;
    }

    if (!formData.pin_code) {
      toast.error("Please enter PIN code.");
      return;
    }

    if (!formData.district) {
      toast.error("Please enter district.");
      return;
    }

    if (!formData.state) {
      toast.error("Please enter state.");
      return;
    }

    if (!formData.exam_center) {
      toast.error("Please select an exam center.");
      return;
    }


    try {

      setLoading(true);

      const payload = {
        ...formData,
        exam_center: Number(formData.exam_center),
      };


      // Pehle application save/update hoga
      const saveResponse = await api.post(
        "/exams/application/",
        payload
      );


      const savedApplication =
        saveResponse.data?.data ||
        saveResponse.data;


      if (savedApplication?.id) {
        setApplicationId(savedApplication.id);
      }


      // Ab final submit
      const submitResponse = await api.post(
        "/exams/application/submit/",
        payload
      );


      toast.success(
        submitResponse.data?.message ||
        "Application submitted successfully!"
      );


      navigate("/payment");


    } catch (error) {

      console.error(error);


      const errors =
        error.response?.data?.errors;


      if (errors) {

        const firstError =
          Object.values(errors)[0];

        toast.error(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );

      } else {

        toast.error(
          error.response?.data?.message ||
          "Unable to submit application."
        );

      }

    } finally {

      setLoading(false);
    }

  };


  return (

    <div className="min-h-screen bg-[#020617] text-white px-4 sm:px-6 py-28">

      {/* Background glow */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-[130px] rounded-full" />

        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />

      </div>


      <div className="relative max-w-6xl mx-auto">


      {/* TOP NAVIGATION BUTTONS */}
<div className="flex items-center justify-between gap-4 mb-8">

  {/* BACK BUTTON */}
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
    border border-white/10 bg-white/5 text-gray-300 font-semibold
    hover:bg-white/10 hover:text-white transition duration-300"
  >
    <span className="text-xl">←</span>
    <span>Back</span>
  </button>

  {/* DASHBOARD BUTTON */}
  <button
    type="button"
    onClick={() => navigate("/dashboard")}
    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
    bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold
    hover:scale-[1.03] transition duration-300
    shadow-lg shadow-blue-900/20"
  >
    <span>Dashboard</span>
    <span className="text-lg">→</span>
  </button>

</div>

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-10">

          <span className="inline-flex px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 text-sm font-bold uppercase tracking-widest">
            Student Application
          </span>


          <h1 className="mt-5 text-4xl md:text-5xl font-black">
            Examination Registration
          </h1>


          <p className="mt-3 text-gray-400 text-lg">
            Complete your application carefully.
            You can save your application as a draft
            and continue later.
          </p>

        </div>


        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >


          {/* ================================= */}
          {/* STUDENT INFORMATION */}
          {/* ================================= */}

          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

            <SectionHeading
              number="01"
              title="Student Information"
              description="Enter your personal details."
            />


            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <Input
                label="Student Full Name"
                name="student_full_name"
                value={formData.student_full_name}
                onChange={handleChange}
                placeholder="Enter student full name"
                required
              />


              <Input
                label="Father Name"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Enter father's name"
                required
              />


              <Input
                label="Mother Name"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                placeholder="Enter mother's name"
                required
              />


              <Input
                label="Aadhaar / ID Number"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                placeholder="Enter Aadhaar or ID number"
                required
              />


              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>

              </Select>


              <Input
                label="Mobile Number"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Enter mobile number"
                maxLength="10"
                required
              />

            </div>

          </section>


          {/* ================================= */}
          {/* ACADEMIC */}
          {/* ================================= */}

          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

            <SectionHeading
              number="02"
              title="Academic Information"
              description="Enter your current academic details."
            />


            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <Input
                label="Class"
                name="student_class"
                value={formData.student_class}
                onChange={handleChange}
                placeholder="Example: Class 10"
                required
              />


              <Input
                label="School Name"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                placeholder="Enter school name"
                required
              />


              <Select
                label="Board"
                name="board"
                value={formData.board}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select board
                </option>

                <option value="UPMSP">
                  UP Board
                </option>

                <option value="CBSE">
                  CBSE
                </option>

                <option value="ICSE">
                  ICSE
                </option>

                <option value="OTHER">
                  Other
                </option>

              </Select>

            </div>

          </section>


          {/* ================================= */}
          {/* ADDRESS */}
          {/* ================================= */}

          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

            <SectionHeading
              number="03"
              title="Address"
              description="Enter your complete residential address."
            />


            <div className="grid md:grid-cols-2 gap-6 mt-8">

              <Input
                label="Village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter village"
                required
              />


              <Input
                label="Post"
                name="post"
                value={formData.post}
                onChange={handleChange}
                placeholder="Enter post"
                required
              />


              <Input
                label="PIN Code"
                name="pin_code"
                value={formData.pin_code}
                onChange={handleChange}
                placeholder="Enter 6-digit PIN code"
                maxLength="6"
                required
              />


              <Input
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />


              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />

            </div>

          </section>


          {/* ================================= */}
          {/* EXAM CENTER */}
          {/* ================================= */}

          <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

            <SectionHeading
              number="04"
              title="Exam Center"
              description="Select your preferred examination center."
            />


            <div className="mt-8">


              {centersLoading ? (

                <div className="border border-white/10 rounded-2xl p-6 text-gray-400">
                  Loading available exam centers...
                </div>

              ) : centers.length === 0 ? (

                <div className="border border-red-400/20 bg-red-500/10 rounded-2xl p-6 text-red-300">
                  No exam center is currently available.
                </div>

              ) : (

                <Select
                  label="Preferred Exam Center"
                  name="exam_center"
                  value={formData.exam_center}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select exam center
                  </option>


                  {centers.map(
                    (center) => (

                      <option
                        key={center.id}
                        value={center.id}
                      >

                        {center.name}
                        {" — "}
                        {center.available_seats}
                        {" seats available"}

                      </option>

                    )
                  )}

                </Select>

              )}

            </div>

          </section>


          {/* ================================= */}
          {/* ACTIONS */}
          {/* ================================= */}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">

            <div className="flex flex-col sm:flex-row gap-4 justify-end">

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={loading}
                className="px-8 py-3.5 rounded-xl border border-cyan-400/40 text-cyan-300 font-bold hover:bg-cyan-400/10 transition disabled:opacity-50"
              >

                {loading
                  ? "Saving..."
                  : "Save Draft"
                }

              </button>


              <button
                type="submit"
                disabled={
                  loading ||
                  centersLoading ||
                  centers.length === 0
                }
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:scale-[1.02] transition shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:hover:scale-100"
              >

                {loading
                  ? "Submitting..."
                  : "Submit Application"
                }

              </button>

            </div>


            <p className="text-sm text-gray-500 mt-5 text-right">
              Please verify all details before submitting.
            </p>

          </div>

        </form>

      </div>

    </div>

  );
}


/* ========================================= */
/* SECTION HEADING */
/* ========================================= */

function SectionHeading({
  number,
  title,
  description,
}) {

  return (

    <div className="flex items-start gap-4">

      <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-black">
        {number}
      </div>

      <div>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="text-gray-400 mt-1">
          {description}
        </p>

      </div>

    </div>

  );
}


/* ========================================= */
/* INPUT */
/* ========================================= */

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
}) {

  return (

    <div>

      <label className="block text-sm font-semibold text-gray-300 mb-2">

        {label}

        {required && (
          <span className="text-red-400 ml-1">
            *
          </span>
        )}

      </label>


      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full h-12 px-4 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
      />

    </div>

  );
}


/* ========================================= */
/* SELECT */
/* ========================================= */

function Select({
  label,
  name,
  value,
  onChange,
  children,
  required = false,
}) {

  return (

    <div>

      <label className="block text-sm font-semibold text-gray-300 mb-2">

        {label}

        {required && (
          <span className="text-red-400 ml-1">
            *
          </span>
        )}

      </label>


      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 bg-[#0f172a] border border-white/10 text-white rounded-xl outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition"
      >

        {children}

      </select>

    </div>

  );
}


export default ApplicationForm;