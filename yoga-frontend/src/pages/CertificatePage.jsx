import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Award,
  Download,
  Calendar,
  CheckCircle2,
  Lock,
  Sparkles,
  Share2,
  ArrowRight,
  User,
  ShieldAlert,
  Loader2,
  FileText,
  RotateCw,
} from "lucide-react";
import CustomPhoneInput from "../components/CustomPhoneInput";
import {
  checkMilestoneCertificates,
  getCertificatePdfUrl,
} from "../services/api";

const TIERS = [
  {
    tier: "bronze",
    days: 50,
    title: "Bronze Certificate",
    subtitle: "50 Days of Yoga",
    badgeLabel: "Bronze",
    color: "#b45309",
    bgColor: "from-amber-50 to-orange-100",
    borderColor: "border-amber-300",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "🥉",
    imageFile: "/certificates/certificate_bronze_50.jpg",
  },
  {
    tier: "silver",
    days: 100,
    title: "Silver Certificate",
    subtitle: "100 Days of Yoga",
    badgeLabel: "Silver",
    color: "#475569",
    bgColor: "from-slate-50 to-gray-200",
    borderColor: "border-slate-300",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    icon: "🥈",
    imageFile: "/certificates/certificate_silver_100.jpg",
  },
  {
    tier: "gold",
    days: 200,
    title: "Gold Certificate",
    subtitle: "200 Days of Yoga",
    badgeLabel: "Gold",
    color: "#d97706",
    bgColor: "from-yellow-50 to-amber-100",
    borderColor: "border-yellow-400",
    badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: "🥇",
    imageFile: "/certificates/certificate_gold_200.jpg",
  },
  {
    tier: "platinum",
    days: 300,
    title: "Platinum Certificate",
    subtitle: "300 Days of Yoga",
    badgeLabel: "Platinum",
    color: "#0284c7",
    bgColor: "from-sky-50 to-cyan-100",
    borderColor: "border-sky-300",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-300",
    icon: "💎",
    imageFile: "/certificates/certificate_platinum_300.jpg",
  },
  {
    tier: "diamond",
    days: 500,
    title: "Diamond Certificate",
    subtitle: "500 Days of Yoga",
    badgeLabel: "Diamond",
    color: "#4f46e5",
    bgColor: "from-indigo-50 to-purple-100",
    borderColor: "border-indigo-300",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    icon: "👑",
    imageFile: "/certificates/certificate_diamond_500.jpg",
  },
];

const CertificatePage = () => {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [selectedTier, setSelectedTier] = useState("bronze");
  const [canvasReady, setCanvasReady] = useState(false);
  const [autoDownloadRequested, setAutoDownloadRequested] = useState(false);
  const canvasRef = useRef(null);

  // Pre-fill phone number from logged-in user or query param
  useEffect(() => {
    const queryPhone = searchParams.get("phone") || searchParams.get("phoneNumber");
    if (queryPhone) {
      setPhoneNumber(queryPhone);
      handleCheck(queryPhone);
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.phoneNumber) {
          setPhoneNumber(parsed.phoneNumber);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleCheck = async (phoneToCheck, shouldAutoDownload = false) => {
    const targetPhone = phoneToCheck || phoneNumber;
    if (!targetPhone || targetPhone.replace(/[^0-9]/g, "").length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    if (shouldAutoDownload) {
      setAutoDownloadRequested(true);
    }

    setLoading(true);
    setErrorInfo(null);
    setResult(null);
    setCanvasReady(false);

    try {
      const response = await checkMilestoneCertificates(targetPhone);
      if (response.data && response.data.success) {
        setResult(response.data);

        // Pick highest unlocked milestone by default, or first unlocked
        const unlocked = response.data.milestones?.filter((m) => m.isCompleted);
        if (unlocked && unlocked.length > 0) {
          const highest = unlocked[unlocked.length - 1];
          setSelectedTier(highest.tier);
        } else {
          setSelectedTier("bronze");
        }

        toast.success(`Welcome ${response.data.user.name}!`);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setErrorInfo(data);
        if (data.error === "NOT_PAID_MEMBER") {
          toast.error(data.message || "Certificates are only for paid members.");
        } else {
          toast.error(data.message || "Failed to check certificate status.");
        }
      } else {
        toast.error("Unable to connect to server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    // If certificate is already loaded for this phone number and milestone is completed, trigger download immediately
    if (result && result.user && canvasReady) {
      const currentM = result.milestones?.find((m) => m.tier === selectedTier);
      if (currentM && currentM.isCompleted) {
        handleDownloadPng();
        return;
      }
    }
    handleCheck(phoneNumber, true);
  };

  // Re-draw canvas whenever selectedTier or result changes
  useEffect(() => {
    if (!result || !result.user) return;

    const currentMilestone = result.milestones?.find((m) => m.tier === selectedTier);
    if (!currentMilestone) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderCanvas = () => {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const rawSrc = currentMilestone.imageUrl || `/certificates/${currentMilestone.imageFile}`;
      const cleanPath = rawSrc.split("?")[0];
      img.src = `${cleanPath}?v=3.0&_t=${Date.now()}`;

      img.onload = () => {
        // Native Full HD 2048 x 1374 Resolution (1:1 with crystal clear template, zero downsampling blur)
        const width = 2048;
        const height = 1374;
        canvas.width = width;
        canvas.height = height;

        // 1. Draw Background Image with high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Draw User's Full Name (Centered horizontally at X=1024, above line at Y=865)
        const studentName = (result.user.name || "Student").trim();
        let fontSize = 70;
        if (studentName.length > 28) fontSize = 50;
        else if (studentName.length > 20) fontSize = 58;

        ctx.save();
        ctx.font = `bold ${fontSize}px "Playfair Display", "Georgia", "Times New Roman", serif`;
        ctx.fillStyle = "#1e293b"; // Rich charcoal
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        const nameX = 1024;
        const nameY = 845;
        ctx.fillText(studentName, nameX, nameY);
        ctx.restore();

        // 3. Draw Milestone Completion Date on the "Date: ________" line (center X=777, above line at Y=1204)
        const displayDate =
          currentMilestone.formattedDate ||
          (currentMilestone.achievedDate
            ? new Date(currentMilestone.achievedDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }));

        ctx.save();
        ctx.font = `600 32px "Playfair Display", "Georgia", serif`;
        ctx.fillStyle = "#334155"; // Slate
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";

        const dateX = 777;
        const dateY = 1195;
        ctx.fillText(displayDate, dateX, dateY);
        ctx.restore();

        setCanvasReady(true);

        // Automatically trigger PNG download if user clicked "Click Here to Download"
        if (autoDownloadRequested) {
          setAutoDownloadRequested(false);
          if (currentMilestone.isCompleted) {
            setTimeout(() => {
              const tierName = currentMilestone?.tier?.toUpperCase() || "MILESTONE";
              const safeName = (result?.user?.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
              const link = document.createElement("a");
              link.download = `YogSaathi_Certificate_${tierName}_${safeName}.png`;
              link.href = canvas.toDataURL("image/png", 1.0);
              link.click();
              toast.success("Certificate downloaded automatically in Full HD PNG!");
            }, 350);
          }
        }
      };

      img.onerror = () => {
        console.error("Failed to load certificate template image:", img.src);
      };
    };

    // Ensure custom fonts are loaded before drawing
    if (document.fonts) {
      document.fonts.ready.then(renderCanvas);
    } else {
      renderCanvas();
    }
  }, [result, selectedTier, autoDownloadRequested]);

  // Handle PNG Image Download for ANY tier directly
  const handleDownloadPngForTier = async (milestone) => {
    if (!milestone) return;
    const tier = milestone.tier;
    const toastId = toast.loading(`Preparing ${tier.toUpperCase()} Certificate...`);

    try {
      const rawSrc = milestone.imageUrl || `/certificates/${milestone.imageFile}`;
      const cleanPath = rawSrc.split("?")[0];
      const imgSrc = `${cleanPath}?v=3.0&_t=${Date.now()}`;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imgSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load template image"));
      });

      const offCanvas = document.createElement("canvas");
      offCanvas.width = 2048;
      offCanvas.height = 1374;
      const ctx = offCanvas.getContext("2d");

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, 2048, 1374);

      // Draw Name
      const studentName = (result?.user?.name || "Student").trim();
      let fontSize = 70;
      if (studentName.length > 28) fontSize = 50;
      else if (studentName.length > 20) fontSize = 58;

      ctx.save();
      ctx.font = `bold ${fontSize}px "Playfair Display", "Georgia", "Times New Roman", serif`;
      ctx.fillStyle = "#1e293b";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(studentName, 1024, 845);
      ctx.restore();

      // Draw Date
      const displayDate =
        milestone.formattedDate ||
        (milestone.achievedDate
          ? new Date(milestone.achievedDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }));

      ctx.save();
      ctx.font = `600 32px "Playfair Display", "Georgia", serif`;
      ctx.fillStyle = "#334155";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(displayDate, 777, 1195);
      ctx.restore();

      const tierName = tier.toUpperCase();
      const safeName = (result?.user?.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
      const link = document.createElement("a");
      link.download = `YogSaathi_Certificate_${tierName}_${safeName}.png`;
      link.href = offCanvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success(`${tierName} Full HD Certificate downloaded!`, { id: toastId });
    } catch (err) {
      console.error("Failed to generate certificate PNG:", err);
      toast.error("Failed to download image. Please try again.", { id: toastId });
    }
  };

  // Handle PDF Download for ANY tier directly
  const handleDownloadPdfForTier = (tier) => {
    if (!result?.user?.phoneNumber) return;
    const url = getCertificatePdfUrl(result.user.phoneNumber, tier);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `YogSaathi_Certificate_${tier.toUpperCase()}_${(result?.user?.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Opening ${tier.toUpperCase()} PDF certificate...`);
  };

  // Handle PNG Image Download from Canvas for current selected tier
  const handleDownloadPng = () => {
    const currentMilestone = result?.milestones?.find((m) => m.tier === selectedTier);
    if (!currentMilestone) return;
    handleDownloadPngForTier(currentMilestone);
  };

  // Handle PDF Download from backend for current selected tier
  const handleDownloadPdf = () => {
    handleDownloadPdfForTier(selectedTier);
  };

  // Handle WhatsApp Share
  const handleWhatsAppShare = () => {
    const currentMilestone = result?.milestones?.find((m) => m.tier === selectedTier);
    const text = encodeURIComponent(
      `🎉 I just earned my ${currentMilestone?.title} (${currentMilestone?.subtitle}) from YogSaathi! 🧘‍♀️✨\nCheck out your yoga journey and classes at https://yogsaathi.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const currentMilestone = result?.milestones?.find((m) => m.tier === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-emerald-50/20 to-white pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold mb-4 border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Honoring Your Consistency & Dedication</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight font-serif mb-4">
            Yoga Participation Certificates
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every day on the mat is a step toward lifelong vitality. Enter your registered mobile number to download your certificates.
          </p>

          {/* Milestone Badges Preview Strip */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            {TIERS.map((tier) => (
              <div
                key={tier.tier}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 border border-gray-200 shadow-xs text-xs font-medium text-gray-700"
              >
                <span>{tier.icon}</span>
                <span>{tier.badgeLabel}</span>
                <span className="text-gray-400">({tier.days} days)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phone Lookup Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 sm:p-8 max-w-xl mx-auto mb-10 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Download Your Certificate
              </h2>
              <p className="text-xs text-gray-500">
                Exclusively available for YogSaathi paid members
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Registered Phone Number
              </label>
              <CustomPhoneInput
                value={phoneNumber}
                onChange={(val) => setPhoneNumber(val)}
                placeholder="Enter 10-digit number"
                required={true}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Attendance & Milestones...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Click Here to Download</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* NOT PAID MEMBER STATE */}
        {errorInfo && errorInfo.error === "NOT_PAID_MEMBER" && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto mb-10 shadow-lg text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Paid Membership Required
            </h3>
            {errorInfo.userName && (
              <p className="text-sm font-semibold text-emerald-700 mb-2">
                Hello, {errorInfo.userName}!
              </p>
            )}
            <p className="text-sm text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed">
              Milestone achievement certificates (Bronze, Silver, Gold, Platinum, Diamond) are exclusively granted to our enrolled paid members based on daily recorded attendance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/price"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-bold text-sm hover:from-emerald-700 hover:to-green-800 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>View Membership Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setErrorInfo(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50"
              >
                Try Another Number
              </button>
            </div>
          </div>
        )}

        {/* USER NOT FOUND STATE */}
        {errorInfo && errorInfo.error === "USER_NOT_FOUND" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto mb-10 text-center">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Account Not Found
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              We couldn't find an account matching that phone number. Please check the digits or join YogSaathi.
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
            >
              <span>Register for Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* SUCCESS / ELIGIBILITY RESULTS */}
        {result && result.user && (
          <div className="space-y-6 animate-fadeIn">
            {/* Check Milestone Status Line - Just above name and attendance days */}
            <div className="flex items-center gap-2.5 pt-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Check Your Certificate Status
              </h2>
            </div>

            {/* User Overview Bar */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {result.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span>{result.user.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Paid Member
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500">{result.user.phoneNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end bg-emerald-50/80 px-4 py-2.5 rounded-xl border border-emerald-100">
                <div className="text-left sm:text-right">
                  <span className="block text-2xs uppercase tracking-wider text-emerald-800 font-semibold">
                    Recorded Attendance
                  </span>
                  <span className="text-xl font-extrabold text-emerald-900">
                    {result.totalAttendanceDays}{" "}
                    <span className="text-xs font-normal text-emerald-700">Days</span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Milestones Tabs / Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                {/* <h3 className="text-base font-bold text-gray-900">
                  Your Milestone Status
                </h3> */}
                <span className="text-xs text-gray-500">
                  Click an unlocked certificate to preview
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {result.milestones.map((m) => {
                  const isSelected = selectedTier === m.tier;
                  const tierConfig = TIERS.find((t) => t.tier === m.tier);
                  const certificateTitle = tierConfig?.title || m.title?.replace(/Milestone/gi, "Certificate") || "Certificate";

                  return (
                    <div
                      key={m.tier}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedTier(m.tier)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedTier(m.tier);
                      }}
                      className={`relative flex flex-col justify-between text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                          : m.isCompleted
                          ? "border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-sm"
                          : "border-gray-200 bg-gray-50/60 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div>
                        {/* Top tier badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">
                            {tierConfig?.icon || "🏆"}
                          </span>
                          {m.isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                              Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-gray-200 text-gray-600">
                              <Lock className="w-3 h-3" />
                              Locked
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-gray-900">{certificateTitle}</h4>
                        <p className="text-xs text-gray-500 mb-2">{m.subtitle}</p>

                        {m.isCompleted ? (
                          <div className="text-xs font-semibold text-emerald-800">
                            {/* Achieved: {m.formattedDate} */}
                            Click Below To Download Certificate
                            <br />
                            <span className="text-2xs font-semibold py-5">
                              (सर्टिफिकेट डाउनलोड करने के लिए नीचे क्लिक करें।)
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                              <div
                                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${m.progressPercent}%` }}
                              />
                            </div>
                            <span className="text-2xs text-gray-500">
                              {m.daysRemaining} days remaining
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Direct Download Actions inside Card */}
                      {m.isCompleted ? (
                        <div className="mt-3 pt-2.5 border-t border-emerald-100/90 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTier(m.tier);
                              handleDownloadPdfForTier(m.tier);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-2xs sm:text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                            title={`Direct Download ${certificateTitle} as PDF`}
                          >
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span>PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTier(m.tier);
                              handleDownloadPngForTier(m);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-2xs sm:text-xs font-bold bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            title={`Direct Download ${certificateTitle} as PNG`}
                          >
                            <Download className="w-3.5 h-3.5 shrink-0" />
                            <span>PNG</span>
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-center gap-1 text-2xs text-gray-400 font-medium py-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* If selected tier is unlocked: Show Certificate Preview & Downloads */}
            {currentMilestone && currentMilestone.isCompleted ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 sm:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{(TIERS.find((t) => t.tier === currentMilestone.tier)?.title || currentMilestone.title?.replace(/Milestone/gi, "Certificate"))} Achieved on {currentMilestone.formattedDate}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-serif">
                      Your Official {currentMilestone.bannerTitle} Certificate
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <button
                      onClick={handleDownloadPng}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image (PNG)</span>
                    </button>

                    <button
                      onClick={handleDownloadPdf}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={handleWhatsAppShare}
                      title="Share Achievement"
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Live Canvas Certificate Preview */}
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-stone-100 max-w-3xl mx-auto">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto block select-none pointer-events-none"
                    style={{ aspectRatio: "2048 / 1374" }}
                  />
                  {!canvasReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Rendering Certificate...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-2xs sm:text-xs text-gray-500">
                    High-resolution certificate • Scaled for printing and digital sharing
                  </p>
                </div>
              </div>
            ) : (
              /* Selected Milestone is Locked */
              <div className="bg-gradient-to-br from-stone-50 to-gray-100 rounded-2xl border border-gray-200 p-8 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-full bg-gray-200 text-gray-500 mx-auto flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {currentMilestone?.title} Locked
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  This milestone requires{" "}
                  <strong className="text-gray-900">{currentMilestone?.days} days</strong> of
                  recorded attendance. You have completed{" "}
                  <strong className="text-emerald-700">{result.totalAttendanceDays} days</strong>.
                </p>

                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 max-w-sm mx-auto">
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                    <span>Progress</span>
                    <span>
                      {result.totalAttendanceDays} / {currentMilestone?.days} Days
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${currentMilestone?.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-2xs text-gray-500 mt-2 text-left">
                    🔥 Just <strong>{currentMilestone?.daysRemaining} more daily classes</strong> to unlock this certificate!
                  </p>
                </div>

                <Link
                  to="/class/join"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Attend Today's Class</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;
