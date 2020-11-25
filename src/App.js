import logo from "./logo.svg";
import "./App.css";
import React, { useState, useMemo, useEffect } from "react";
import { observable, Reaction } from "mobx";

function observer(component) {
  return (props) => {
    console.log("tt");
    let [tick, updateTick] = useState(0);
    let r = useMemo(
      () =>
        new Reaction(null, () => {
          updateTick(tick + 1);
        }),
      [tick]
    );

    useEffect(() => () => {
      console.log("disposed");
      r.dispose();
      return () => {
        console.log("unmount");
      };
    });

    let render;
    r.track(() => {
      render = component({ ...props, tick });
    });
    return render;
  };
}

let data = observable({
  name: "initial name",
});

export default observer(function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>name: {data.name}</p>
        <input onChange={(e) => (data.name = e.target.value)} /> ☝🏼 change text
        here!
      </header>
    </div>
  );
});
