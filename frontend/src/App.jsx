import React, { useState, useEffect } from "react";

const auth = window.osmAuth.osmAuth({
  client_id: "Qk9MOLiU_jxEbWiiwOL-g6g1b9jY3J2cF4k25NmCWQI",
  scope: "read_prefs",
  redirect_uri: `${window.location.origin}/powered/land.html`,
  singlepage: false,
});

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [wayId, setWayId] = useState("");

  function fetchUserDetails() {
    auth.xhr({ method: "GET", path: "/api/0.6/user/details" }, (err, res) => {
      if (err) {
        setError("Failed to fetch user details");
        return;
      }

      const userEl = res.getElementsByTagName("user")[0];
      const changesets = res.getElementsByTagName("changesets")[0];

      setUser({
        name: userEl.getAttribute("display_name"),
        id: userEl.getAttribute("id"),
        count: changesets.getAttribute("count"),
      });
      setError("");
    });
  }

  useEffect(() => {
    if (
      window.location.search.includes("code=") &&
      !auth.authenticated() &&
      !user &&
      !error
    ) {
      auth.authenticate(() => {
        window.history.pushState({}, null, window.location.pathname);
        fetchUserDetails();
      });
    }
  }, []);

  function handleLogin() {
    auth.authenticate(() => fetchUserDetails());
  }

  function handleLogout() {
    auth.logout();
    setUser(null);
    setError("");
  }

  function handleWayIdSubmit() {
    if (!auth.authenticated()) {
      setError("You must be logged in to submit.");
      return;
    }

    auth.xhr(
      {
        method: "POST",
        path: "https://backend-sparkling-wave-2107.fly.dev/mark_nodes_as",
        prefix: false,
        options: {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      },
      (err, res) => {
        console.log("res:", res);
        console.log("err:", err);
        const data = res.responseText;
      }
    );
  }

  return (
    <>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>

      {error && <> {error} </>}
      {user ? <> Authenticated: {user.name}</> : <> Not logged in. </>}

      <div>
        <label htmlFor="wayId">
          Mark all nodes of this way ID as power poles:
        </label>
        <input
          id="wayId"
          type="number"
          value={wayId}
          onChange={(e) => setWayId(e.target.value)}
        />
        <button onClick={handleWayIdSubmit}>Submit</button>
      </div>
    </>
  );
}
