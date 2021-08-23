/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { useEffect } from "react";
import store from "../store";
import { State } from "../reducers";
import { connect } from "react-redux";
import { UserState } from "../reducers/user";
import { userFetch } from "../actions/user";

interface HomePageProps {
    readonly loggedInUser: UserState
}

function HomePage({ loggedInUser }: HomePageProps) {
    useEffect(() => {
        !("resource" in loggedInUser) && store.dispatch(userFetch());
    }, [loggedInUser]);

    return (
        <Flex>
            {"resource" in loggedInUser && (<div>
                <h3>id: {loggedInUser.resource.id}</h3>
                <h3>username: {loggedInUser.resource.username}</h3>
            </div>)}
        </Flex>
    );
}

function mapStateToProps(state: State): HomePageProps {
    return {
        loggedInUser: state.loggedInUser,
    };
}

export default connect(mapStateToProps)(HomePage);
