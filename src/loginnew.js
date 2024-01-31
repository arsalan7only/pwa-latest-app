import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import axios from "axios";

const Loginnew = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHome, setShowHome] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let test = await subscribeUser();
    console.log("test", test);
    let payload = {
      username: inputUsername,
      password: inputPassword,
      token: test,
    };
    // fetch("https://node-mongo-api-g1v4.onrender.com/api/v1/login",
    // fetch("http://localhost:3006/api/v1/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(payload),
    // }).then((res) => {
    axios
      .post("https://node-mongo-api-g1v4.onrender.com/api/v1/login", payload)
      .then((res) => {
        if (res.status == 200 && res.data.msg !== "inviled credential") {
          setLoading(false);
          setShowHome(true);
        } else {
          setShow(true);
          setShowHome(false);
          setLoading(false);
        }
        console.log("test", res);
      });
  };

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
  return (
    <div>
      {!showHome ? (
        <div
          className="sign-in__wrapper"
          style={{ backgroundImage: `url(${"./img/background.jpg"})` }}
        >
          {/* Overlay */}
          <div className="sign-in__backdrop"></div>
          {/* Form */}
          <Form
            className="shadow p-4 bg-white rounded"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="h4 mb-2 text-center">Sign In</div>
            {/* ALert */}
            {show ? (
              <Alert
                className="mb-2"
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                Incorrect username or password.
              </Alert>
            ) : (
              <div />
            )}
            <Form.Group className="mb-2" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={inputUsername}
                placeholder="Username"
                onChange={(e) => setInputUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={inputPassword}
                placeholder="Password"
                onChange={(e) => setInputPassword(e.target.value)}
                required
              />
            </Form.Group>
            {!loading ? (
              <Button className="w-100" variant="primary" type="submit">
                Log In
              </Button>
            ) : (
              <Button
                className="w-100"
                variant="primary"
                type="submit"
                disabled
              >
                Logging In...
              </Button>
            )}
          </Form>

          <div></div>
        </div>
      ) : (
        <div>
          <h3>Welcome</h3>
        </div>
      )}
    </div>
  );
};

export default Loginnew;
