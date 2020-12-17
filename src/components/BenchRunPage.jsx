import React, {Component} from "react";
import "./anim.css";
import {RunPage} from "./RunPage";
import {IOTest} from "../bench/IOTest";
import {renderMaxPossibleObjects} from "../webgl";
import { SingleThreadTest } from "../bench/SingleThreadTest";

export class BenchRunPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      phase: 0,
      testDone: []
    };
    this.testTriggered = false;
  }
  runTests() {
    
    let io = new IOTest(100, () => {
      io.runAllMultiple(50, (e) => {
        this.setState({
          testDone: [
            ...this.state.testDone,
            { name: "DISK", score: Math.floor(e) }
          ]
        });
        //invoke new tests
        renderMaxPossibleObjects().then(value => {
          this.setState({
            testDone: [
              ...this.state.testDone,
              { name: "GPU", score: Math.floor(value) }
            ]
          })
        }).then(()=> {
          new SingleThreadTest().runTest((s) => {
            this.setState({
              testDone: [
                ...this.state.testDone,
                { name: "CPU", score: s }
              ]
            })
            setTimeout(()=> {
              //this.setState({phase: 3})
            }, 4000)
          });
        });
      });
    });
  }
  shouldComponentUpdate(newProps, newState) {
    if (this.state.phase !== newState.phase) {
      if (!this.testTriggered && newState.phase === 1) {
        this.testTriggered = true;
        setTimeout(() => {
          this.runTests();
        }, 1000);
      }
    }
    return true;
  }
  renderPhase0() {
    return (
      <RunPage
        onClick={() => {
          this.setState({ phase: 1 });
        }}
      />
    );
  }
  renderPhase1() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 120,
            marginBottom: 120
          }}
        >
          <img
            style={{ height: 130, width: 130 }}
            alt="broke"
            src="https://westwoodgroup.com/wp-content/uploads/2018/05/icons-light-blue-16.png"
          />
          <img
            class="rotating"
            style={{ position: "absolute", height: 250, width: 250 }}
            alt="broke"
            src="https://i.stack.imgur.com/yLhGR.png"
          />
        </div>
        {this.state.testDone.map((obj) => {
          return (
            <div
              style={{
                backgroundColor: "lightblue",
                height: 80,
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                borderRadius: 7,
                margin: 10,
                borderColor: "blue",
                borderWidth: 50
              }}
            >
              <span style={{ color: "white", fontSize: 25 }}>
                {obj.name + " - " + obj.score}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    if (this.state.phase === 0) {
      return this.renderPhase0();
    } else if (this.state.phase === 1) {
      return this.renderPhase1();
    } else if (this.state.phase === 3) {
      // load the final component
    }
  }
}
