import React from 'react';
import { motion } from 'framer-motion';

export default function DataTable({ columns, data, onRowClick, actions }) {
  return (
    <div className="w-full overflow-hidden border border-enterprise-line rounded-xl">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-enterprise-line scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="sticky top-0 z-10 bg-enterprise-soft border-b border-enterprise-line">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-4 text-xs font-black text-nalco-blue uppercase tracking-widest"
                  style={{ width: col.width || 'auto' }}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-xs font-black text-nalco-blue uppercase tracking-widest text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-enterprise-line bg-white">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <motion.tr
                  key={rowIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.05 }}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    group transition-colors duration-200 cursor-pointer
                    ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-enterprise-soft/30'}
                    hover:bg-nalco-blue/[0.02]
                  `}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-5 text-base font-medium text-enterprise-ink">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="px-6 py-20 text-center text-enterprise-muted font-medium italic"
                >
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
