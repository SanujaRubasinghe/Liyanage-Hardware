'use client';
import React from 'react';
import { Link } from '../router-compat';

// `trail` is an ordered list of { name, slug } from root to the current category.
const Breadcrumbs = ({ trail }) => {
  let pathSoFar = '';

  return (
    <nav aria-label="Breadcrumb" className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-[#cc0000] transition-colors">Home</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/category" className="hover:text-[#cc0000] transition-colors">Categories</Link>
        </li>
        {trail.map((node, index) => {
          pathSoFar += `/${node.slug}`;
          const isLast = index === trail.length - 1;
          return (
            <React.Fragment key={node.slug}>
              <li aria-hidden="true">/</li>
              <li>
                {isLast ? (
                  <span className="text-gray-900 font-semibold">{node.name}</span>
                ) : (
                  <Link href={`/category${pathSoFar}`} className="hover:text-[#cc0000] transition-colors">
                    {node.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
