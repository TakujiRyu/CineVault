import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import { supabase } from "../lib/supabaseClient";

const defaultPrivacySettings = {
  personalized_recommendations: false,
  save_viewing_history: false,
  analytics_tracking: false,
  marketing_emails: false,
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [privacySettings, setPrivacySettings] = useState(
    defaultPrivacySettings,
  );
  const [activeTab, setActiveTab] = useState("mylist");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchMovies = async () => {
    const res = await fetch("http://localhost:3000/data/movieData.json");
    const data = await res.json();
    setMovies(data);
  };

  const fetchProfileData = async (currentUser) => {
    const [
      { data: myListData, error: myListError },
      { data: continueData, error: continueError },
      { data: privacyData, error: privacyError },
    ] = await Promise.all([
      supabase
        .from("my_list")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("continue_watching")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("last_watched_at", { ascending: false }),
      supabase
        .from("privacy_settings")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle(),
    ]);

    if (myListError) throw myListError;
    if (continueError) throw continueError;
    if (privacyError) throw privacyError;

    setMyList(myListData || []);
    setContinueWatching(continueData || []);

    if (privacyData) {
      setPrivacySettings({
        personalized_recommendations: privacyData.personalized_recommendations,
        save_viewing_history: privacyData.save_viewing_history,
        analytics_tracking: privacyData.analytics_tracking,
        marketing_emails: privacyData.marketing_emails,
      });
    } else {
      const { error: insertError } = await supabase
        .from("privacy_settings")
        .insert([
          {
            user_id: currentUser.id,
            ...defaultPrivacySettings,
          },
        ]);

      if (insertError) throw insertError;
      setPrivacySettings(defaultPrivacySettings);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(session.user);

        await Promise.all([fetchMovies(), fetchProfileData(session.user)]);
      } catch (err) {
        setError(err.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const movieMap = useMemo(() => {
    const map = new Map();
    movies.forEach((movie) => {
      map.set(Number(movie._id), movie);
    });
    return map;
  }, [movies]);

  const myListMovies = useMemo(() => {
    return myList
      .map((item) => ({
        ...item,
        movie: movieMap.get(Number(item.movie_id)),
      }))
      .filter((item) => item.movie);
  }, [myList, movieMap]);

  const continueMovies = useMemo(() => {
    return continueWatching
      .map((item) => ({
        ...item,
        movie: movieMap.get(Number(item.movie_id)),
      }))
      .filter((item) => item.movie);
  }, [continueWatching, movieMap]);

  const handleRemoveMyList = async (id) => {
    const { error } = await supabase.from("my_list").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setMyList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveContinue = async (id) => {
    const { error } = await supabase
      .from("continue_watching")
      .delete()
      .eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    setContinueWatching((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSavePrivacySettings = async () => {
    if (!user) return;

    try {
      setSavingSettings(true);
      setError("");
      setSuccessMessage("");

      const { error } = await supabase.from("privacy_settings").upsert(
        {
          user_id: user.id,
          ...privacySettings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;

      setSuccessMessage("Privacy settings updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save privacy settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleClearContinueWatching = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("continue_watching")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    setContinueWatching([]);
    setSuccessMessage("Viewing history cleared.");
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      setExportingData(true);
      setError("");
      setSuccessMessage("");

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        account: {
          email: user.email,
          userId: user.id,
        },
        privacySettings,
        myList: myListMovies.map((item) => ({
          savedAt: item.created_at,
          movie: {
            id: item.movie._id,
            title: item.movie.title,
            year: item.movie.year,
            category: item.movie.category,
            length: item.movie.length,
          },
        })),
        continueWatching: continueMovies.map((item) => ({
          lastWatchedAt: item.last_watched_at,
          progress: item.progress ?? 0,
          movie: {
            id: item.movie._id,
            title: item.movie.title,
            year: item.movie.year,
            category: item.movie.category,
            length: item.movie.length,
          },
        })),
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cinevault-my-data.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Your data export has been generated.");
    } catch (err) {
      setError(err.message || "Failed to export data.");
    } finally {
      setExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "This will permanently delete your CineVault account and all associated data. Do you want to continue?",
    );

    if (!confirmed) return;

    try {
      setDeletingAccount(true);
      setError("");
      setSuccessMessage("");

      const { error } = await supabase.functions.invoke("delete-account", {
        body: {},
      });

      if (error) {
        throw new Error(error.message || "Failed to delete account.");
      }

      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="profilePage">
        <div className="profileWrapper">
          <h2 className="profileHeading">Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profilePage">
        <div className="profileWrapper">
          <h2 className="profileHeading">You need to sign in first.</h2>
          <div className="profileEmptyActions">
            <Link to="/signin" className="profileLinkBtn">
              Go to Sign In
            </Link>
            <Link to="/" className="profileLinkBtn secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profilePage">
      <div className="profileWrapper">
        <div className="profileTop">
          <div>
            <h1 className="profileTitle">My Profile</h1>
            <p className="profileSubtitle">{user.email}</p>
          </div>
          <Link to="/" className="profileLinkBtn secondary">
            Back to Home
          </Link>
        </div>

        {error && <div className="profileError">{error}</div>}
        {successMessage && (
          <div className="profileSuccess">{successMessage}</div>
        )}

        <div className="profileTabs">
          <button
            className={activeTab === "mylist" ? "active" : ""}
            onClick={() => setActiveTab("mylist")}
          >
            My List ({myListMovies.length})
          </button>
          <button
            className={activeTab === "continue" ? "active" : ""}
            onClick={() => setActiveTab("continue")}
          >
            Continue Watching ({continueMovies.length})
          </button>
          <button
            className={activeTab === "privacy" ? "active" : ""}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy Settings
          </button>
        </div>

        {activeTab === "mylist" && (
          <div className="profileSection">
            {myListMovies.length === 0 ? (
              <div className="profileEmpty">
                No movies saved in My List yet.
              </div>
            ) : (
              <div className="profileGrid">
                {myListMovies.map((item) => (
                  <div className="profileCard" key={item.id}>
                    <img src={item.movie.previewImg} alt={item.movie.title} />
                    <div className="profileCardBody">
                      <h3>{item.movie.title}</h3>
                      <p>
                        {item.movie.length} | {item.movie.category}
                      </p>
                      <span className="profileMeta">
                        Saved on {new Date(item.created_at).toLocaleString()}
                      </span>
                      <button
                        className="profileActionBtn"
                        onClick={() => handleRemoveMyList(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "continue" && (
          <div className="profileSection">
            <div className="profileSectionTop">
              <h2>Continue Watching</h2>
              {continueMovies.length > 0 && (
                <button
                  className="profileActionBtn secondaryBtn"
                  onClick={handleClearContinueWatching}
                >
                  Clear All
                </button>
              )}
            </div>

            {continueMovies.length === 0 ? (
              <div className="profileEmpty">
                No continue watching items yet.
              </div>
            ) : (
              <div className="profileGrid">
                {continueMovies.map((item) => (
                  <div className="profileCard" key={item.id}>
                    <img src={item.movie.previewImg} alt={item.movie.title} />
                    <div className="profileCardBody">
                      <h3>{item.movie.title}</h3>
                      <p>
                        {item.movie.length} | {item.movie.category}
                      </p>
                      <span className="profileMeta">
                        Last watched{" "}
                        {new Date(item.last_watched_at).toLocaleString()}
                      </span>
                      <div className="profileCardActions">
                        <Link
                          to={`/player/${item.movie._id}`}
                          className="profileLinkBtn"
                        >
                          Watch Again
                        </Link>
                        <button
                          className="profileActionBtn"
                          onClick={() => handleRemoveContinue(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="profileSection">
            <div className="privacyPanel">
              <h2>Privacy Settings</h2>
              <p className="privacyIntro">
                CineVault keeps privacy controls in the product from the start.
                Choose which optional personalization and tracking features you
                want to enable.
              </p>

              <div className="privacyOption">
                <div>
                  <h4>Personalized Recommendations</h4>
                  <p>
                    Allow CineVault to use your activity for recommendations.
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="personalized_recommendations"
                    checked={privacySettings.personalized_recommendations}
                    onChange={handleSettingChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacyOption">
                <div>
                  <h4>Save Viewing History</h4>
                  <p>
                    Store your viewing activity for history and continuation
                    features.
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="save_viewing_history"
                    checked={privacySettings.save_viewing_history}
                    onChange={handleSettingChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacyOption">
                <div>
                  <h4>Analytics Tracking</h4>
                  <p>
                    Allow optional analytics to improve platform performance.
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="analytics_tracking"
                    checked={privacySettings.analytics_tracking}
                    onChange={handleSettingChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacyOption">
                <div>
                  <h4>Marketing Emails</h4>
                  <p>Receive optional emails about new content and updates.</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="marketing_emails"
                    checked={privacySettings.marketing_emails}
                    onChange={handleSettingChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacyBlock">
                <h3>Privacy Notice</h3>
                <p>
                  CineVault collects only the data needed to provide streaming,
                  account access, saved lists, and optional personalization.
                  Optional settings such as viewing history, recommendations,
                  analytics, and marketing are under your control and can be
                  changed at any time.
                </p>
              </div>

              <div className="privacyBlock">
                <h3>Data Controls</h3>
                <p>
                  You can export your saved profile data or clear your viewing
                  history directly from this page.
                </p>

                <div className="privacyActionRow">
                  <button
                    className="profileActionBtn"
                    onClick={handleExportData}
                    disabled={exportingData}
                  >
                    {exportingData ? "Exporting..." : "Export My Data"}
                  </button>

                  <button
                    className="profileActionBtn dangerBtn"
                    onClick={handleClearContinueWatching}
                  >
                    Clear Viewing History
                  </button>
                </div>
              </div>

              <div className="privacyBlock dangerBlock">
                <h3>Delete Account</h3>
                <p>
                  Permanently delete your CineVault account and all associated
                  profile data. This action cannot be undone.
                </p>

                <div className="privacyActionRow">
                  <button
                    className="profileActionBtn dangerBtn"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount
                      ? "Deleting Account..."
                      : "Delete My Account"}
                  </button>
                </div>
              </div>

              <div className="privacyActions">
                <button
                  className="profileActionBtn"
                  onClick={handleSavePrivacySettings}
                  disabled={savingSettings}
                >
                  {savingSettings ? "Saving..." : "Save Privacy Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
