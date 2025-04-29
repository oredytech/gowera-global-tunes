
// Article content styling
export const articleStyles = `
  .article-content h1, .article-content h2, .article-content h3, 
  .article-content h4, .article-content h5, .article-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.3;
  }
  
  .article-content h1 {
    font-size: 1.75rem;
  }
  
  .article-content h2 {
    font-size: 1.5rem;
  }
  
  .article-content h3 {
    font-size: 1.25rem;
  }
  
  .article-content p {
    margin-bottom: 1.25em;
    line-height: 1.7;
  }
  
  .article-content img {
    margin: 2em auto;
    border-radius: 0.5rem;
    max-width: 100%;
    height: auto;
  }
  
  .article-content figure {
    margin: 2em 0;
  }
  
  .article-content figure figcaption {
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.5em;
    color: hsl(var(--muted-foreground));
  }
  
  .article-content ul, .article-content ol {
    margin: 1.25em 0;
    padding-left: 1.5em;
  }
  
  .article-content li {
    margin-bottom: 0.5em;
  }
  
  .article-content blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid hsl(var(--primary));
    background-color: hsl(var(--muted)/0.2);
    font-style: italic;
    border-radius: 0.25rem;
  }
  
  .article-content a {
    color: hsl(var(--primary));
    text-decoration: none;
  }
  
  .article-content a:hover {
    text-decoration: underline;
  }
  
  .article-content iframe {
    margin: 1.5em auto;
    max-width: 100%;
  }
  
  .article-content table {
    margin: 1.5em 0;
    width: 100%;
    border-collapse: collapse;
  }
  
  .article-content table th,
  .article-content table td {
    padding: 0.5em;
    border: 1px solid hsl(var(--border));
  }
  
  .article-content pre {
    margin: 1.5em 0;
    padding: 1em;
    background-color: hsl(var(--muted));
    border-radius: 0.25rem;
    overflow-x: auto;
  }
`;
