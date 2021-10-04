/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { State } from "../reducers";
import { connect } from "react-redux";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";

function HomePage() {
  return (
    <Flex className="flex-container">
      <Sidebar />
      <Map />
    </Flex>
  );
}

function mapStateToProps(state: State) {
  return {
    loggedInUser: state.loggedInUser,
  };
}

export default connect(mapStateToProps)(HomePage);
