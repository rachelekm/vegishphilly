/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";

function Error({ ...props }) {
  return (
    <Flex {...props}>
      <h1>Oh no, an error!</h1>
    </Flex>
  );
}

export default Error;
