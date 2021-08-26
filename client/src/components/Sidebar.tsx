/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { State } from "../reducers";
import { connect } from "react-redux";
import { RestaurantsState } from "../reducers/restaurants";

interface SidebarProps {
    readonly restaurants: RestaurantsState
    //ratings?
}

function Sidebar({ restaurants }: SidebarProps) {
    const restaurantData = "resource" in restaurants ? restaurants.resource : null;
    const allRestaurants = restaurantData?.restaurants;

    const renderedRestaurants = allRestaurants && allRestaurants.features.length > 0 ?
        allRestaurants.features.map(feature => {
            return <li className='restaurant-item' key={allRestaurants.features.indexOf(feature)}>
                <h3 className='item-name'>{feature.properties.name}</h3>
                <h4 className='item-address'>{feature.properties.address}</h4>
                <h4 className='item-overall-rating'>Avg Rating: </h4>
            </li>
        }) :
        'There are no restaurants in this area.'

    return (
        <Flex className='sidebar'>
            <div className='search-box'>
                Search city here
            </div>
            <ul className='sidebar-list'>
                {renderedRestaurants}
            </ul>
            <div className='add-res-box'></div>
        </Flex>
    );

}

function mapStateToProps(state: State): SidebarProps {
    return {
        restaurants: state.restaurants
    };
}

export default connect(mapStateToProps)(Sidebar);
