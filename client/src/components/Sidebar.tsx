/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from "theme-ui";
import { State } from "../reducers";
import store from "../store";
import { connect } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { RestaurantsState } from "../reducers/restaurants";
import { restaurantsFetch } from "../actions/restaurants";
import { MapDataState } from "../reducers/mapdata";

interface SidebarProps {
    readonly restaurants: RestaurantsState
    readonly mapData: MapDataState
}

function Sidebar({ restaurants, mapData }: SidebarProps) {
    const restaurantData = "resource" in restaurants ? restaurants.resource : null;
    const pag_count = Math.ceil((Number(restaurantData?.restaurants.count) / 5));
    const [currentPag, setCurentPag] = useState<number>(1);
    const prev = restaurantData?.restaurants.previous
    const next = restaurantData?.restaurants.next
    const allRestaurants = restaurantData?.restaurants.results;

    useEffect(() => {
        mapData.data.bounds && currentPag && store.dispatch(restaurantsFetch([mapData.data.bounds, currentPag]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPag])

    const renderedRestaurants = allRestaurants && allRestaurants.features.length > 0 ?
        allRestaurants.features.map(feature => {
            return <li className='restaurant-item' key={allRestaurants.features.indexOf(feature)}>
                <h3 className='item-name'>{feature.properties.name}</h3>
                <h4 className='item-address'>{feature.properties.address}</h4>
                {feature.properties.average_rating ? <h4 className='item-overall-rating'>Avg Rating: {feature.properties.average_rating} stars</h4>
                    : <h4 className='item-overall-rating'>There are no ratings</h4>}

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
            {pag_count > 1 && <nav className='pagination-nav'>
                <ul className='pagination'>
                    {
                        prev ?
                            prev.includes('page=') ? <li key='prev'><button onClick={(event: React.MouseEvent<HTMLElement>) => setCurentPag(parseInt(prev?.slice(-1)))}>prev</button></li> :
                                <li key='prev'><button onClick={(event: React.MouseEvent<HTMLElement>) => setCurentPag(1)}>prev</button></li>
                            :
                            <li key='prev'><button disabled={true}>prev</button></li>
                    }
                    {
                        [...Array(pag_count),].map((v: undefined, i: number) => {
                            return <li key={i + 1}><button onClick={(event: React.MouseEvent<HTMLElement>) => setCurentPag(i + 1)}>{i + 1}</button></li>
                        })
                    }
                    {
                        next ?
                            <li key='next'><button onClick={(event: React.MouseEvent<HTMLElement>) => setCurentPag(parseInt(next?.slice(-1)))}>next</button></li> :
                            <li key='next'><button disabled={true}>next</button></li>
                    }
                </ul>
            </nav>}
            <div className='add-res-box'></div>
        </Flex>
    );

}

function mapStateToProps(state: State): SidebarProps {
    return {
        restaurants: state.restaurants,
        mapData: state.mapData
    };
}

export default connect(mapStateToProps)(Sidebar);
