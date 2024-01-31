import React, { useState, useEffect } from "react";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          if (registration.pushManager) {
            return registration.pushManager.getSubscription();
          }
          throw new Error("PushManager not available");
        })
        .then((subscription) => {
          if (subscription === null) {
            subscribeUser();
          }
        })
        .catch((error) => {
          console.error("Error checking pushManager:", error);
        });
    }
  }, []);

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const convertedVapidKey = urlBase64ToUint8Array(
        "BKdeaCCBxk3lnIJGRRHlhxKcF1kDyFiWeh0YX0Pfr6rXaPTEDWmL-E-h6vmbIXJntVnEhBNx6Y9QmBcbP5MyWAo"
      );

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      console.log("User is subscribed:", subscription);
      return subscription;
    } catch (error) {
      console.error("Failed to subscribe the user:", error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let test = await subscribeUser();
    console.log("test", test);
    let payload = {
      username,
      password,
      token: test,
    };
    fetch("https://node-mongo-api-g1v4.onrender.com/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status == 200 && res.data !== "inviled credential") {
        setIsLoggedIn(true);
      }
      console.log("test", res);
    });
  };
  return (
    <div>
      <div className="App">
        {!isLoggedIn ? (
          <div class="container">
            <div class="card">
              <h2>Login form</h2>
              <form>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" onClick={(e) => handleSubmit(e)}>
                  Login
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <h3>Welcome</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
