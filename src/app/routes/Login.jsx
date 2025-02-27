import { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/rosefire.min.js"; // ✅ Ensure this file exists in `/public`
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    setLoading(true);
    if (!window.Rosefire) {
      setError("Rosefire script not loaded!");
      setLoading(false);
      return;
    }

    window.Rosefire.signIn("62c320b3-a749-4d11-9994-4ce75959e8c5", async (err, rfUser) => {
      if (err) {
        setError("Rosefire login failed.");
        setLoading(false);
        return;
      }

      try {
        await signInWithCustomToken(auth, rfUser.token);
      } catch (error) {
        setError("Firebase login failed: " + error.message);
      }

      setLoading(false);
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold">Sign in to Continue</h2>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleLogin}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login with Rose-Hulman SSO"}
        </button>
      </div>
    </div>
  );
}
