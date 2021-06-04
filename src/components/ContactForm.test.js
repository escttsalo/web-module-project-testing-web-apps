import React from 'react';
import {queryByTestId, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);

    const formHeader = screen.queryByText(/contact form/i);

    expect(formHeader).toBeInTheDocument();
    expect(formHeader).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/first name*/i)
    userEvent.type(firstName, 'a')
    const errors = screen.getAllByTestId('error');

    // userEvent.type(firstName, 'a')
    expect(errors[0]).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);

    const submit = screen.getByRole('button');
    userEvent.click(submit);
    const errors = screen.getAllByTestId('error');

    expect(errors[0]).toBeInTheDocument();
    expect(errors[1]).toBeInTheDocument();
    expect(errors[2]).toBeInTheDocument();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const submit = screen.getByRole('button');
    userEvent.type(firstName, 'Jonny');
    userEvent.type(lastName, 'Bravo');
    userEvent.click(submit)

    const errors = screen.queryByTestId('error');

    expect(errors).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, 'somee@amil');
    
    const emailError = await screen.findByText(/email must be a valid email address./);
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);

    const submit = screen.getByRole('button');
    userEvent.click(submit);

    const error = await screen.findByText(/lastname is a required field/i);
    expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const button = screen.getByRole('button');

    userEvent.type(firstName,'Butters');
    userEvent.type(lastName,'Stocth');
    userEvent.type(email, 'email@email.com');
    userEvent.click(button);

    await waitFor(() => {
        const displayFirst = screen.queryByText('Butters');
        const displayLast = screen.queryByText('Stocth');
        const displayEmail = screen.queryByText('email@email.com');
        const message = screen.queryByTestId('messageDisplay');

        expect(displayFirst).toBeInTheDocument();
        expect(displayLast).toBeInTheDocument();
        expect(displayEmail).toBeInTheDocument();
        expect(message).not.toBeInTheDocument();
    })

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const message = screen.getByLabelText(/message/i);

    userEvent.type(firstName, 'Johny');
    userEvent.type(lastName,'Appleseed');
    userEvent.type(email,'email@email.com');
    userEvent.type(message, 'text goes here');
    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const displayFirst = screen.queryByText('Johny');
        const displayLast = screen.queryByText('Appleseed');
        const displayEmail = screen.queryByText('email@email.com');
        const message = screen.queryByTestId(/message/i);

        expect(displayFirst).toBeInTheDocument();
        expect(displayLast).toBeInTheDocument();
        expect(displayEmail).toBeInTheDocument();
        expect(message).toBeInTheDocument();
    })
});