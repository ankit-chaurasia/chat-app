import React from 'react';
import { shallow } from 'enzyme';
import Layout from '../index';
import ChatContainer from '../../chat-container';
import LoginForm from '../../login-form';

describe('Layout', () => {
  let testContext;

  const createComponent = (props = {}) => shallow(<Layout {...props} />);

  describe('when there is no current user', () => {
    beforeEach(() => {
      testContext = {};
      testContext.layout = createComponent();
      testContext.loginForm = testContext.layout.find(LoginForm);
      testContext.chatContainer = testContext.layout.find(ChatContainer);
    });

    it('renders LoginForm', () => {
      expect(testContext.loginForm.exists()).toBe(true);
    });
    it('does not render ChatContainer', () => {
      expect(testContext.chatContainer.exists()).toBe(false);
    });
  });

  describe('when there is current user', () => {
    beforeEach(() => {
      testContext = {};
      testContext.layout = createComponent();
      testContext.layout.instance().setUser('currentuser');
    });

    it('does not render LoginForm', () => {
      expect(testContext.layout.find(LoginForm).exists()).toBe(false);
    });
    it('render ChatContainer', () => {
      expect(testContext.layout.find(ChatContainer).exists()).toBe(true);
    });

    describe('when user logout', () => {
      beforeEach(() => {
        testContext.layout.instance().logout();
      });

      it('renders LoginForm', () => {
        expect(testContext.layout.find(LoginForm).exists()).toBe(true);
      });
      it('does not render ChatContainer', () => {
        expect(testContext.layout.find(ChatContainer).exists()).toBe(false);
      });
    });
  });
});
