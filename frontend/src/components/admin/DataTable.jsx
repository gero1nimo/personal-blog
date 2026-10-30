// Yeniden kullanılabilir, sayfalı tablo. Kolonlar { key, label, render? } biçiminde verilir.
const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  emptyText = "Kayıt bulunamadı.",
  page = 1,
  pages = 1,
  total = 0,
  onPageChange,
  renderActions,
}) => {
  const colCount = columns.length + (renderActions ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.label}
                </th>
              ))}
              {renderActions ? (
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-gray-400">
                  Yükleniyor...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-gray-400">
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 align-top">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions ? (
                    <td className="px-4 py-3 text-right whitespace-nowrap align-top">
                      {renderActions(row)}
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
        <span>Toplam {total} kayıt</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Önceki
          </button>
          <span>
            Sayfa {page} / {Math.max(pages, 1)}
          </span>
          <button
            type="button"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page >= pages}
            className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
          >
            Sonraki
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
