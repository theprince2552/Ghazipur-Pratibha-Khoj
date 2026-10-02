import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    Download,
    MapPin,
    Printer,
    User,
    FileText,
    Loader2,
} from "lucide-react";

import api from "../api/axios";
import logo from "../assets/images/logo.png";
import signature from "../assets/images/signature.png";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";


function AdmitCard() {

    const navigate = useNavigate();

    const [admitCard, setAdmitCard] = useState(null);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH ADMIT CARD
    // =====================================================

    useEffect(() => {

        const fetchAdmitCard = async () => {

            try {

                setLoading(true);

                const response = await api.get("/dashboard/");

                if (!response.data?.success) {

                    toast.error("Unable to load admit card.");

                    return;
                }

                const data = response.data.data;

                if (!data?.admit_card) {

                    toast.error(
                        "Your admit card has not been generated yet."
                    );

                    navigate("/dashboard");

                    return;
                }

                setAdmitCard(data.admit_card);

            } catch (error) {

                console.error(
                    "ADMIT CARD ERROR:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load admit card."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAdmitCard();

    }, [navigate]);


    // =====================================================
    // PRINT
    // =====================================================

    const handlePrint = () => {

        window.print();

    };


// =====================================================
// DOWNLOAD
// =====================================================

const handleDownload = async () => {
  const original = document.getElementById("admit-card");

  if (!original) {
    toast.error("Admit card not found.");
    return;
  }

  try {
    toast.loading("Preparing PDF...", { id: "pdf-download" });

    // Create a clean clone
    const clone = original.cloneNode(true);

    // Fixed desktop/A4-like width
    clone.style.width = "1000px";
    clone.style.maxWidth = "1000px";
    clone.style.minWidth = "1000px";
    clone.style.height = "auto";
    clone.style.background = "#ffffff";
    clone.style.color = "#111827";
    clone.style.margin = "0";
    clone.style.padding = "0";
    clone.style.borderRadius = "0";
    clone.style.boxShadow = "none";
    clone.style.overflow = "visible";

    // Put clone outside visible screen
    const wrapper = document.createElement("div");

    wrapper.style.position = "absolute";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.width = "1000px";
    wrapper.style.background = "#ffffff";
    wrapper.style.overflow = "visible";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Remove buttons/header controls which should not be in PDF
    clone.querySelectorAll(".print\\:hidden").forEach((el) => {
      el.remove();
    });

    // Force desktop layout
    clone.querySelectorAll("[class]").forEach((el) => {
      const classes = Array.from(el.classList);

      // Remove responsive classes
      classes.forEach((cls) => {
        if (cls.startsWith("sm:")) {
          el.classList.remove(cls);
        }
      });
    });

    // Candidate rows
    clone.querySelectorAll(".grid").forEach((el) => {
      el.style.display = "grid";
    });

    // Specifically fix candidate detail rows
    clone.querySelectorAll(".grid").forEach((el) => {
      const text = el.textContent || "";

      if (
        text.includes("Student Name") ||
        text.includes("Father Name") ||
        text.includes("Mother Name") ||
        text.includes("Gender")
      ) {
        el.style.gridTemplateColumns = "190px 1fr 110px 1fr";
      }
    });

    // Fix examination detail rows
    clone.querySelectorAll(".grid").forEach((el) => {
      const text = el.textContent || "";

      if (
        text.includes("Exam Date") ||
        text.includes("Exam Time") ||
        text.includes("Reporting Time") ||
        text.includes("Exam Center")
      ) {
        el.style.gridTemplateColumns = "290px 1fr";
      }
    });

    // Force header desktop layout
    const headerFlex = clone.querySelector("header > div");

    if (headerFlex) {
      headerFlex.style.display = "flex";
      headerFlex.style.flexDirection = "row";
      headerFlex.style.alignItems = "center";
    }

    // Wait for browser rendering
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    const dataUrl = await toPng(clone, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      width: 1000,
    });

    // Remove temporary DOM
    wrapper.remove();

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    const margin = 6;

    const pdfWidth = pageWidth - margin * 2;

    const img = new Image();

    img.src = dataUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const pdfHeight = (img.height * pdfWidth) / img.width;

    pdf.addImage(
      dataUrl,
      "PNG",
      margin,
      margin,
      pdfWidth,
      pdfHeight,
      undefined,
      "FAST"
    );

    const applicationNumber =
      admitCard?.application_number || "GPK-Admit-Card";

    pdf.save(`${applicationNumber}-Admit-Card.pdf`);

    toast.success("PDF downloaded successfully.", {
      id: "pdf-download",
    });

  } catch (error) {
    console.error("PDF DOWNLOAD ERROR:", error);

    toast.error("PDF download failed.", {
      id: "pdf-download",
    });
  }
};

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="
          min-h-screen
          bg-[#020617]
          flex
          items-center
          justify-center
          text-white
        "
            >

                <div className="text-center">

                    <Loader2
                        size={42}
                        className="
              mx-auto
              animate-spin
              text-cyan-400
            "
                    />

                    <p className="mt-4 text-gray-400">
                        Loading Admit Card...
                    </p>

                </div>

            </div>

        );

    }


    if (!admitCard) {

        return null;

    }


    // =====================================================
    // AUTOMATIC YEAR
    // =====================================================

    const examYear = new Date(
        `${admitCard.exam_date}T00:00:00`
    ).getFullYear();


    return (

        <div
            className="
        min-h-screen
        bg-[#020617]
        px-4
        py-8
        print:bg-white
        print:p-0
      "
        >


            {/* =================================================
          ACTION BUTTONS
      ================================================= */}

            <div
                className="
          mx-auto
          mb-6
          flex
          max-w-[1000px]
          items-center
          justify-between
          print:hidden
        "
            >

                <button
                    onClick={() => navigate("/dashboard")}
                    className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2.5
            text-sm
            text-gray-300
            transition
            hover:bg-white/10
            hover:text-white
          "
                >

                    <ArrowLeft size={17} />

                    Back to Dashboard

                </button>


                <div className="flex gap-3">

                    <button
                        onClick={handlePrint}
                        className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-cyan-400/30
              bg-cyan-400/10
              px-4
              py-2.5
              text-sm
              font-semibold
              text-cyan-300
              hover:bg-cyan-400/20
            "
                    >

                        <Printer size={17} />

                        Print

                    </button>


                    <button
                        onClick={handleDownload}
                        className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-cyan-400
              px-4
              py-2.5
              text-sm
              font-bold
              text-[#041018]
              hover:bg-cyan-300
            "
                    >

                        <Download size={17} />

                        Download

                    </button>

                </div>

            </div>



    {/* =================================================
          A4 ADMIT CARD
        ================================================= */}

            <div
                id="admit-card"
                className="
          mx-auto
          w-full
          max-w-[1000px]
          overflow-hidden
          rounded-xl
          border
          border-[#1d5f91]
          bg-white
          text-slate-900
          shadow-2xl
          print:max-w-none
          print:rounded-none
          print:shadow-none
        "
            >


    {/* =================================================
            HEADER
        ================================================= */}

                <header
                    className="
            border-b-[6px]
            border-[#149ee8]
            px-6
            py-3
            sm:px-8
          "
                >

                    <div
                        className="
              flex
              items-center
              gap-5
            "
                    >

                        {/* LOGO */}

                        <div
                            className="
                h-[105px]
                w-[105px]
                shrink-0
                flex
                items-center
                justify-center
              "
                        >

                            <img
                                src={logo}
                                alt="Ghazipur Pratibha Khoj"
                                className="
                  h-full
                  w-full
                  object-contain
                "
                            />

                        </div>


                        {/* TITLE */}

                        <div className="flex-1 text-center">

                            <h1
                                className="
                  text-3xl
                  font-black
                  uppercase
                  tracking-wide
                  text-[#12396b]
                  sm:text-5xl
                "
                            >
                                GHAZIPUR PRATIBHA KHOJ
                            </h1>


                            <div
                                className="
                  mt-1
                  flex
                  items-center
                  justify-center
                  gap-4
                "
                            >

                                <span
                                    className="
                    hidden
                    h-[3px]
                    w-20
                    bg-[#1685d8]
                    sm:block
                  "
                                />


                                <span
                                    className="
                    text-2xl
                    font-black
                    tracking-wider
                    text-[#1685d8]
                    sm:text-4xl
                  "
                                >
                                    GPK {examYear}
                                </span>


                                <span
                                    className="
                    hidden
                    h-[3px]
                    w-20
                    bg-[#1685d8]
                    sm:block
                  "
                                />

                            </div>

                        </div>

                    </div>

                </header>



    {/* =================================================
            APPLICATION NUMBER
        ================================================= */}

                <div
                    className="
            mx-5
            mt-3
            overflow-hidden
            rounded-lg
            border
            border-[#54b9ed]
            bg-[#eaf7ff]
            sm:mx-7
          "
                >

                    <div
                        className="
              flex
              min-h-[55px]
              items-center
            "
                    >

                        <div
                            className="
                w-[35%]
                px-5
                text-base
                font-black
                text-[#163b68]
                sm:text-lg
              "
                        >
                            Application Number
                        </div>


                        <div
                            className="
                h-8
                w-[2px]
                bg-[#9ccbe7]
              "
                        />


                        <div
                            className="
                flex-1
                text-center
                text-xl
                font-black
                tracking-wider
                text-[#1685d8]
                sm:text-3xl
              "
                        >
                            {admitCard.application_number}
                        </div>

                    </div>

                </div>



    {/* =================================================
            CANDIDATE DETAILS
        ================================================= */}

                <section
                    className="
            mx-5
            mt-3
            sm:mx-7
          "
                >

                    <div
                        className="
              overflow-hidden
              rounded-lg
              border
              border-slate-300
            "
                    >

                        {/* TITLE */}

                        <div
                            className="
                flex
                items-center
                gap-3
                bg-[#fffaf0]
                px-4
                py-2
              "
                        >

                            <div
                                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  bg-[#153e70]
                  text-white
                "
                            >

                                <User size={18} />

                            </div>


                            <h2
                                className="
                  text-lg
                  font-black
                  text-[#111827]
                "
                            >
                                Candidate Details
                            </h2>

                        </div>


                        {/* TABLE */}

                        <div>

                            <CandidateRow
                                label1="Student Name"
                                value1={admitCard.student_name}
                                label2="Class"
                                value2={admitCard.student_class}
                            />


                            <CandidateRow
                                label1="Father Name"
                                value1={admitCard.father_name}
                            />


                            <CandidateRow
                                label1="Mother Name"
                                value1={admitCard.mother_name}
                                last
                            />

                        </div>

                    </div>

                </section>



    {/* =================================================
            EXAMINATION DETAILS
        ================================================= */}

                <section
                    className="
            mx-5
            mt-3
            sm:mx-7
          "
                >

                    <div
                        className="
              overflow-hidden
              rounded-lg
              border
              border-[#28a9ed]
            "
                    >

                        {/* TITLE */}

                        <div
                            className="
                flex
                items-center
                gap-3
                bg-[#eaf7ff]
                px-4
                py-2
              "
                        >

                            <div
                                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  bg-[#1685d8]
                  text-white
                "
                            >

                                <CalendarDays size={18} />

                            </div>


                            <h2
                                className="
                  text-lg
                  font-black
                  text-[#153b68]
                "
                            >
                                Examination Details
                            </h2>

                        </div>


                        {/* CENTER */}

                        <ExamRow
                            label="Exam Center"
                            value={admitCard.exam_center}
                        />


                        {/* VENUE */}

                        <ExamRow
                            label="Exam Venue / Address"
                            value={admitCard.exam_venue}
                        />


                        {/* DATE + TIME */}

                        <ExamRow
                            label="Exam Date"
                            value={formatDate(
                                admitCard.exam_date
                            )}
                        />


                        {/* EXAM TIME */}

                        <ExamRow
                            label="Exam Time"
                            value={formatTime(
                                admitCard.exam_time
                            )}
                        />


                        {/* REPORTING */}

                        <ExamRow
                            label="Reporting Time"
                            value={formatTime(
                                admitCard.reporting_time
                            )}
                        />

                    </div>

                </section>



    {/* =================================================
            IMPORTANT INSTRUCTIONS
        ================================================= */}

                <section
                    className="
            mx-5
            mt-3
            sm:mx-7
          "
                >

                    <div
                        className="
              overflow-hidden
              rounded-lg
              border
              border-[#dfb9df]
            "
                    >

                        {/* TITLE */}

                        <div
                            className="
                flex
                items-center
                gap-3
                bg-[#fff1fc]
                px-4
                py-2
              "
                        >

                            <div
                                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  bg-[#71356f]
                  text-white
                "
                            >

                                <FileText size={18} />

                            </div>


                            <h2
                                className="
                  text-lg
                  font-black
                  text-[#171717]
                "
                            >
                                Important Instructions
                            </h2>

                        </div>


                        {/* LIST */}

                        <ol
                            className="
                list-decimal
                space-y-1
                px-8
                py-3
                pl-10
                text-sm
                leading-5
                text-slate-800
              "
                        >

                            <li>
                                Candidate must bring a printed copy of this
                                admit card to the examination center.
                            </li>


                            <li>
                                Candidate should report at the examination
                                center before the reporting time.
                            </li>


                            <li>
                                Keep the admit card safe until the completion
                                of the examination process.
                            </li>


                            <li>
                                Follow all instructions provided by the
                                examination authorities at the center.
                            </li>


                            <li>
                                Candidate must carry the required documents
                                as instructed by the examination authority.
                            </li>

                        </ol>

                    </div>

                </section>



                {/* =================================================
                FOOTER
                ================================================= */}

                <footer
                    className="
            mx-5
            mb-4
            mt-3
            rounded-lg
            border
            border-slate-300
            bg-[#f7fafc]
            px-5
            py-3
            sm:mx-7
          "
                >

                    <div
                        className="
              flex
              items-end
              justify-between
              gap-8
            "
                    >

                        {/* ISSUED BY */}

                        <div>

                            <p
                                className="
                  text-sm
                  text-slate-700
                "
                            >
                                Issued by
                            </p>


                            <p
                                className="
                  text-xl
                  font-black
                  text-slate-900
                "
                            >
                                Ghazipur Pratibha Khoj
                            </p>


                            <p
                                className="
                  text-base
                  text-slate-700
                "
                            >
                                Examination Authority
                            </p>

                        </div>


                        {/* SIGNATURE */}

                        <div
                            className="
                min-w-[220px]
                text-center
              "
                        >

                            <img
                                src={signature}
                                alt="Authorized Signature"
                                className="
                  mx-auto
                  h-[55px]
                  w-auto
                  max-w-[170px]
                  object-contain
                "
                            />


                            <div
                                className="
                  border-t
                  border-slate-500
                "
                            />


                            <p
                                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
                            >
                                Authorized Signature
                            </p>


                            <p
                                className="
                  mt-1
                  text-xs
                  text-slate-500
                "
                            >
                                Admit Card Status
                            </p>


                            <p
                                className="
                  text-3xl
                  font-black
                  text-green-600
                "
                            >
                                VALID
                            </p>

                        </div>

                    </div>

                </footer>


            </div>



            {/* =================================================
          PRINT CSS
      ================================================= */}

            <style>
                {`

          @media print {

            @page {
              size: A4 portrait;
              margin: 7mm;
            }


            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }


            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }


            #admit-card {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }


            #admit-card header,
            #admit-card section,
            #admit-card footer {
              break-inside: avoid;
            }

          }

        `}
            </style>

        </div>

    );

}


// =====================================================
// CANDIDATE ROW
// =====================================================

function CandidateRow({
    label1,
    value1,
    label2,
    value2,
    last = false,
}) {

    return (

        <div
            className={`
        grid
        grid-cols-1
        border-slate-200
        sm:grid-cols-[190px_1fr_110px_1fr]
        ${!last ? "border-b" : ""}
      `}
        >

            {/* LABEL 1 */}

            <div
                className="
          bg-[#f8fafc]
          px-4
          py-2
          text-sm
          font-black
          text-slate-800
        "
            >
                {label1}
            </div>


            {/* VALUE 1 */}

            <div
                className="
          px-4
          py-2
          text-sm
          font-medium
          text-slate-900
        "
            >
                {value1 || "-"}
            </div>


            {/* LABEL 2 */}

            {label2 && (

                <div
                    className="
            border-t
            border-slate-200
            bg-[#f8fafc]
            px-4
            py-2
            text-sm
            font-black
            text-slate-800
            sm:border-l
            sm:border-t-0
          "
                >
                    {label2}
                </div>

            )}


            {/* VALUE 2 */}

            {label2 && (

                <div
                    className="
            border-t
            border-slate-200
            px-4
            py-2
            text-sm
            font-medium
            text-slate-900
            sm:border-t-0
          "
                >
                    {value2 || "-"}
                </div>

            )}

        </div>

    );

}


// =====================================================
// EXAM ROW
// =====================================================

function ExamRow({
    label,
    value,
    split = false,
}) {

    return (

        <div
            className={`
        grid
        grid-cols-1
        border-t
        border-slate-200
        sm:grid-cols-[290px_1fr]
        ${split ? "sm:border-l" : ""}
      `}
        >

            <div
                className="
          bg-[#f8fafc]
          px-4
          py-2
          text-sm
          font-black
          text-slate-800
        "
            >
                {label}
            </div>


            <div
                className="
          border-t
          border-slate-200
          px-4
          py-2
          text-sm
          font-medium
          text-slate-900
          sm:border-t-0
        "
            >
                {value || "-"}
            </div>

        </div>

    );

}


// =====================================================
// DATE FORMAT
// =====================================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date = new Date(
        `${value}T00:00:00`
    );


    if (Number.isNaN(date.getTime())) {
        return value;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );

}


// =====================================================
// TIME FORMAT
// =====================================================

function formatTime(value) {

    if (!value) {
        return "-";
    }


    const [hours, minutes] =
        value.split(":");


    if (
        hours === undefined ||
        minutes === undefined
    ) {
        return value;
    }


    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );

}


export default AdmitCard;