/** @jsxRuntime classic */
/** @jsx jsx */
import { connect } from "react-redux";
import { jsx, Box, Flex, Heading, Card, Label, Input, Button } from "theme-ui";
import { RouteComponentProps } from "react-router";
import { LoginCredentials, LoginCredentialsError } from "../models";
import { setCredentials, loginAttempt } from "../actions/auth";
import { AuthState } from "../reducers/auth";
import { State } from "../reducers";
import store from "../store";

interface SignInProps {
  readonly onSubmit: () => void;
  readonly error?: LoginCredentialsError;
  readonly credentials?: LoginCredentials;
}

function SignInCard({ onSubmit, error, credentials }: SignInProps) {
  return (
    <Card>
      {error && error.detail && (
        <div>
          <div>Error: {error.detail}</div>
        </div>
      )}
      <Box>
        <Box
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            autoFocus
            onChange={(e) => {
              store.dispatch(setCredentials({ ...credentials, username: e.currentTarget.value }));
            }}
          />
          {error &&
            error.username &&
            error.username.map((err, i) => (
              <div key={i}>
                <div>{err}</div>
              </div>
            ))}
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            onChange={(e) => {
              store.dispatch(setCredentials({ ...credentials, password: e.currentTarget.value }));
            }}
          />
          {error &&
            error.password &&
            error.password.map((err, i) => (
              <div key={i}>
                <div>{err}</div>
              </div>
            ))}

          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

interface StateProps {
  readonly authState: AuthState;
}

function AuthPage({ authState, history }: StateProps & RouteComponentProps<"history">) {
  return (
    <Flex>
      <Heading as="h1">Veg-ish Philly</Heading>
      <SignInCard
        error={"errorMessage" in authState ? authState.errorMessage : undefined}
        credentials={"data" in authState ? authState.data : undefined}
        onSubmit={() => {
          store.dispatch(loginAttempt({ successNav: { nextPath: "/", history: history } }));
        }}
      />
    </Flex>
  );
}

function mapStateToProps(state: State): StateProps {
  return {
    authState: state.auth,
  };
}

export default connect(mapStateToProps)(AuthPage);
