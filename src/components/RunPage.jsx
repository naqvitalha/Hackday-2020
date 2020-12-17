import React, {Component} from "react";

export class RunPage extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 100
        }}
      >
        <img
          style={{ height: 250, width: 250 }}
          alt="broke"
          src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/cpu2.png"
        />
        <div
          style={{
            backgroundColor: "#00C9FF",
            marginTop: 50,
            width: 150,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={this.props.onClick}
        >
          <span style={{ color: "white" }}> Run Scan </span>
        </div>
      </div>
    );
  }
}
