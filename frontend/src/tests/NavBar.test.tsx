import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  const navbarTexts = ['Home', 'Weather map', 'Trip To Do'];
  const navbarIcons = ['fa-home', 'fa-globe', 'fa-check-square-o'];

  test('initally renders closed navbar', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const navbar = screen.getByTestId('closed-navbar');
    expect(navbar).toBeDefined();
  });

  test('Renders correct icons when closed and no text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const navbar = screen.getByTestId('closed-navbar');
    expect(navbar).toBeDefined();

    navbarTexts.forEach((text) => {
      expect(screen.queryByText(text)).toBeNull();
    });

    navbarIcons.forEach((icon) => {
      expect(screen.getByTestId(icon)).toBeDefined();
    });

    expect(screen.getByTestId('fa-chevron-right'));
  });

  test('Opens when toggle button is clicked and closes when toggle is clicked again', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const toggle = screen.getByLabelText('toggle for navigation bar');
    await user.click(toggle);
    const expandedNavbar = screen.getByTestId('expanded-navbar');
    expect(expandedNavbar).toBeDefined();
    await user.click(toggle);
    const closedNavbar = screen.getByTestId('closed-navbar');
    expect(closedNavbar).toBeDefined();
  });

  test('Opens when toggle button is keypressed and closes when toggle is keypressed again', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggle = screen.getByLabelText('toggle for navigation bar');
    fireEvent.keyDown(toggle, { key: 'Enter', code: 'Enter', charCode: 13 });
    const expandedNavbar = screen.getByTestId('expanded-navbar');
    expect(expandedNavbar).toBeDefined();
    fireEvent.keyDown(toggle, { key: 'Enter', code: 'Enter', charCode: 13 });
    const closedNavbar = screen.getByTestId('closed-navbar');
    expect(closedNavbar).toBeDefined();
  });

  test('Renders correct icons and text when open', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const toggle = screen.getByLabelText('toggle for navigation bar');
    await user.click(toggle);

    navbarTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeDefined();
    });

    navbarIcons.forEach((icon) => {
      expect(screen.getByTestId(icon)).toBeDefined();
    });

    expect(screen.getByTestId('fa-chevron-left'));
  });

  test('Opens when toggle button is clicked and closes when any navbar item is clicked', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const user = userEvent.setup();
    const toggle = screen.getByLabelText('toggle for navigation bar');
    await user.click(toggle);
    const expandedNavbar = screen.getByTestId('expanded-navbar');
    expect(expandedNavbar).toBeDefined();
    const item = screen.getAllByLabelText('navigation bar link element')[0];
    await user.click(item);
    const closedNavbar = screen.getByTestId('closed-navbar');
    expect(closedNavbar).toBeDefined();
  });

  test('Opens when toggle button is keypressed and closes when any navbar item is keypressed', async () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const toggle = screen.getByLabelText('toggle for navigation bar');
    fireEvent.keyDown(toggle, { key: 'Enter', code: 'Enter', charCode: 13 });
    const expandedNavbar = screen.getByTestId('expanded-navbar');
    expect(expandedNavbar).toBeDefined();
    const item = screen.getAllByLabelText('navigation bar link element')[0];
    fireEvent.keyDown(item, { key: 'Enter', code: 'Enter', charCode: 13 });
    const closedNavbar = screen.getByTestId('closed-navbar');
    expect(closedNavbar).toBeDefined();
  });

  test('Opens when toggle button is clicked and closes when anywhere else in the screen is clicked than the navbar', async () => {
    render(
      <div>
        <p>Anywhere else</p>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </div>
    );

    const user = userEvent.setup();
    const toggle = screen.getByLabelText('toggle for navigation bar');
    await user.click(toggle);
    const expandedNavbar = screen.getByTestId('expanded-navbar');
    expect(expandedNavbar).toBeDefined();

    const anywhereElse = screen.getByText('Anywhere else');
    await user.click(anywhereElse);
    const closedNavbar = screen.getByTestId('closed-navbar');
    expect(closedNavbar).toBeDefined();
  });
});
