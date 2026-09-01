import React, { forwardRef } from 'react';

const borderColor = 'rgba(148, 163, 184, 0.32)';

export const SearchIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="16.65" y1="16.65" x2="21" y2="21" />
  </svg>
);

export const FileSearchIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <circle cx="11" cy="15" r="3" />
    <path d="m13.2 17.2 2.3 2.3" />
  </svg>
);

export const SendIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const CartIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

export const SimpleInput = forwardRef(function SimpleInput(
  { prefix, suffix, size, style, disabled, value, onChange, placeholder, autoFocus, type = 'text', ...rest },
  ref
) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        minHeight: size === 'large' ? 46 : 40,
        padding: '0 12px',
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        background: disabled ? 'rgba(148, 163, 184, 0.08)' : '#fff',
        color: '#0f172a',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {prefix && <span style={{ display: 'inline-flex', color: '#64748b' }}>{prefix}</span>}
      <input
        ref={ref}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        style={{ border: 0, outline: 0, flex: 1, minWidth: 0, background: 'transparent', font: 'inherit', color: 'inherit' }}
        {...rest}
      />
      {suffix && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{suffix}</span>}
    </div>
  );
});

export function SimpleSkeleton({ loading, children }) {
  if (!loading) return children;
  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 16, padding: 18, background: '#fff' }}>
      {[0, 1, 2, 3].map((row) => (
        <div key={row} style={{ height: 18, margin: row === 0 ? '0 0 14px' : '14px 0 0', width: `${86 - row * 11}%`, borderRadius: 999, background: 'linear-gradient(90deg, #eef2f7, #f8fafc, #eef2f7)' }} />
      ))}
    </div>
  );
}

export function SimpleTable({ dataSource = [], columns = [], rowKey }) {
  const rows = Array.isArray(dataSource) ? dataSource : [];
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${borderColor}`, borderRadius: 16, background: '#fff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.dataIndex || column.title} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: `1px solid ${borderColor}`, whiteSpace: 'nowrap' }}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 24, color: '#64748b', textAlign: 'center' }}>No data available</td></tr>
          ) : (
            rows.map((record, rowIndex) => {
              const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] || rowIndex;
              return (
                <tr key={key}>
                  {columns.map((column) => {
                    const value = record?.[column.dataIndex];
                    return (
                      <td key={column.key || column.dataIndex || column.title} style={{ padding: '14px 16px', borderBottom: rowIndex === rows.length - 1 ? 0 : `1px solid ${borderColor}`, color: '#0f172a', fontSize: 14, verticalAlign: 'middle' }}>
                        {column.render ? column.render(value, record, rowIndex) : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function SimpleModal({ title, open, visible, onCancel, onOk, confirmLoading, okText = 'OK', children }) {
  const isOpen = open ?? visible;
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(15, 23, 42, 0.48)' }}>
      <div style={{ width: 'min(520px, 100%)', borderRadius: 20, background: '#fff', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.28)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 22px', borderBottom: `1px solid ${borderColor}`, fontWeight: 700, fontSize: 18 }}>{title}</div>
        <div style={{ padding: 22, display: 'grid', gap: 14 }}>{children}</div>
        <div style={{ padding: '16px 22px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onCancel} style={{ padding: '10px 16px', borderRadius: 10, border: `1px solid ${borderColor}`, background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={onOk} disabled={confirmLoading} style={{ padding: '10px 16px', borderRadius: 10, border: 0, background: '#0f172a', color: '#fff', cursor: confirmLoading ? 'not-allowed' : 'pointer', opacity: confirmLoading ? 0.7 : 1 }}>{confirmLoading ? 'Processing...' : okText}</button>
        </div>
      </div>
    </div>
  );
}

export function IconAction({ title, onClick, children }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${borderColor}`, background: '#fff', color: '#0f172a', display: 'inline-grid', placeItems: 'center', cursor: 'pointer' }}>
      {children}
    </button>
  );
}
