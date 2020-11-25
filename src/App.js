import logo from "./logo.svg";
import "./App.css";
import React, { useState, useMemo, useEffect } from "react";
import { action, makeAutoObservable, observable, Reaction } from "mobx";

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

// let data = observable({
//   name: "initial name",
// });

function fetchData(name) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: "ok", name }), 1000);
  });
}

class Data {
  name = "";

  constructor(name) {
    makeAutoObservable(this, {
      name: observable,
      change: action,
    });
  }

  async change(name) {
    // this.name = [await fetchData(name)]["name"]; //不会报错，但是不会触发异常
    // this.name = [await fetchData(name)]; //报错，不能直接渲染对象: Error: Objects are not valid as a React child (found: object with keys {data, name}). If you meant to render a collection of children, use an array instead.

    // this.name = name; // ok

    /**
     * OK！see:https://mobx.js.org/actions.html#asynchronous-actions
     */
    fetchData(name).then(
      // ok
      action("fetchdata", ({ name }) => {
        this.name = name;
      })
    );
  }
}
let data = new Data("initial name");
export default observer(function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* {function () {
          console.log("demo");
        }} */}
        <img src={logo} className="App-logo" alt="logo" />
        <p>name: {data.name}</p>
        <input onChange={(e) => data.change(e.target.value)} /> ☝🏼 change text
        here!
      </header>
    </div>
  );
});
