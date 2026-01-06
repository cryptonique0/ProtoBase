import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';

describe('ProjectWorkspacePage', () => {
  it('renders without crashing', () => {
    // Minimal props for rendering
    render(<ProjectWorkspacePage />);
    expect(screen.getByText(/No Active Project|Project Overview/)).toBeDefined();
  });
});
