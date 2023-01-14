export default (rows) => {
    rows = rows.map(row => ({id: row["Group ID"]}))

    let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.id).join("\n");

    const link = document.createElement('a')
    link.href = csvContent;
    link.download = "export.csv";
    link.click()
    URL.revokeObjectURL(link.href)
}