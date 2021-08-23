/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Loading() {
    return (
        <Flex>
            <Icon icon={faSpinner} spin={true} />
        </Flex>
    );
}
