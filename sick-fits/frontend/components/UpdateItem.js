/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
        query SINGLE_ITEM_QUERY($id: ID!) {
                item(where: { id: $id }) {
                        id
                        title
                        description
                }
        }
`;

const UPDATE_ITEM_MUTATION = gql`
        mutation UPDATE_ITEM_MUTATION($id: ID!, $title: String, $description: String, $price: Int) {
                updateItem(id: $id, title: $title, description: $description, price: $price) {
                        id
                }
        }
`;

class UpdateItem extends Component {
        state = {};

        handleChange = event => {
                const { name, type, value } = event.target;
                const val = type === 'number' ? parseFloat(value) : value;
                this.setState({ [name]: val });
        };

        updateItem = async (event, updateItemMutation) => {
                event.preventDefault();
                const response = await updateItemMutation({
                        variables: {
                                id: this.props.id,
                                ...this.state,
                        },
                });
        };

        render() {
                return (
                        <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                                {({ data, loading }) => {
                                        if (loading) return <p>Loading...</p>;
                                        if (!data.item) return <p>No Item Found!</p>;
                                        return (
                                                <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                                                        {(updateItem, { loading, error }) => (
                                                                <Form
                                                                        onSubmit={event =>
                                                                                this.updateItem(event, updateItem)
                                                                        }
                                                                >
                                                                        <Error error={error} />
                                                                        <fieldset
                                                                                disabled={loading}
                                                                                aria-busy={loading}
                                                                        >
                                                                                <label htmlFor="title">
                                                                                        Title
                                                                                        <input
                                                                                                type="text"
                                                                                                id="title"
                                                                                                name="title"
                                                                                                placeholder="Title"
                                                                                                required
                                                                                                defaultValue={
                                                                                                        data.item.title
                                                                                                }
                                                                                                onChange={
                                                                                                        this
                                                                                                                .handleChange
                                                                                                }
                                                                                        />
                                                                                </label>

                                                                                <label htmlFor="price">
                                                                                        Price
                                                                                        <input
                                                                                                type="number"
                                                                                                id="price"
                                                                                                name="price"
                                                                                                placeholder="Price"
                                                                                                required
                                                                                                defaultValue={
                                                                                                        data.item.price
                                                                                                }
                                                                                                onChange={
                                                                                                        this
                                                                                                                .handleChange
                                                                                                }
                                                                                        />
                                                                                </label>

                                                                                <label htmlFor="description">
                                                                                        Description
                                                                                        <textarea
                                                                                                type="text"
                                                                                                id="description"
                                                                                                name="description"
                                                                                                placeholder="Description"
                                                                                                required
                                                                                                defaultValue={
                                                                                                        data.item
                                                                                                                .description
                                                                                                }
                                                                                                onChange={
                                                                                                        this
                                                                                                                .handleChange
                                                                                                }
                                                                                        />
                                                                                </label>
                                                                                <button type="submit">
                                                                                        Sav{loading ? 'ing' : 'e'}{' '}
                                                                                        Changes
                                                                                </button>
                                                                        </fieldset>
                                                                </Form>
                                                        )}
                                                </Mutation>
                                        );
                                }}
                        </Query>
                );
        }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
