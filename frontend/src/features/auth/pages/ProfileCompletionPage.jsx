import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../authAPI";
import { getAccessToken, clearAuth } from "../../../services/apiClient";
import { useUser } from "../../../contexts/UserContext";

const ProfileCompletionPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [fullName, setFullName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!getAccessToken()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setProfilePhoto(file || null);
    if (errors.profilePhoto) {
      setErrors((prev) => ({ ...prev, profilePhoto: "" }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!fullName.trim()) {
      validationErrors.fullName = "Full name is required.";
    }

    if (!profilePhoto) {
      validationErrors.profilePhoto = "Profile photo is required.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("profilePhoto", profilePhoto);

    setIsLoading(true);
    setErrors({});

    try {
      const response = await completeProfile(formData);
      await refreshUser();
      setToast({
        message: response.message || "Profile completed successfully.",
        type: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Profile completion error:", err);
      if (err.response?.status === 401) {
        clearAuth();
        navigate("/login");
        return;
      }

      setErrors({
        general:
          err.response?.data?.message ||
          "Unable to complete profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Upload a profile photo and your full name to finish account setup.
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
                disabled={isLoading}
                className={`block w-full rounded-2xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.fullName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Jane Doe"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={isLoading}
                className="block w-full text-sm text-gray-700"
              />
              {errors.profilePhoto && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.profilePhoto}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center rounded-2xl bg-blue-600 px-4 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Saving profile..." : "Submit Profile"}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <div className="fixed top-6 right-6 rounded-lg bg-green-600 px-5 py-3 text-white shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProfileCompletionPage;
