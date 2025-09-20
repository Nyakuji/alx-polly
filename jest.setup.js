import '@testing-library/jest-dom';
require('dotenv').config({ path: '.env.test' });

// Polyfill for TextEncoder
import { TextEncoder, TextDecoder } from 'util';

if (typeof global !== 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}