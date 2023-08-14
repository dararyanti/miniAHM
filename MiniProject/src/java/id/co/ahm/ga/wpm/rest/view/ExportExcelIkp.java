package id.co.ahm.ga.wpm.rest.view;

import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import static org.apache.poi.ss.usermodel.Font.BOLDWEIGHT_BOLD;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;


/**
 *
 * @author Irzan Maulana
 */
public class ExportExcelIkp extends AbstractXlsView {

    @Override
    protected void buildExcelDocument(Map<String, Object> model, Workbook workbook,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            List<VoShowTableIkp> data = (List<VoShowTableIkp>) model.get("IKP");
            Sheet sheet = workbook.createSheet("Tabel_Maintain_IKP");

            CellStyle cellStyleTitle = workbook.createCellStyle();
            cellStyleTitle.setAlignment(CellStyle.ALIGN_CENTER);

            Row header = sheet.createRow(0);

            createCellHeader(workbook, header, "No", 0);
            createCellHeader(workbook, header, "IKP ID", 1);
            createCellHeader(workbook, header, "Supplier ID", 2);
            createCellHeader(workbook, header, "Nama Supplier", 3);
            createCellHeader(workbook, header, "Tipe Order", 4);
            createCellHeader(workbook, header, "Nomor PO/SPK/SPK Sementara", 5);
            createCellHeader(workbook, header, "Plant Pekerjaan", 6);
            createCellHeader(workbook, header, "Nomor Pengajuan Proyek", 7);
            createCellHeader(workbook, header, "Login Patrol", 8);
            createCellHeader(workbook, header, "NRP PIC Project", 9);
            createCellHeader(workbook, header, "Seksi PIC Project", 10);
            createCellHeader(workbook, header, "Departemen PIC Project", 11);
            createCellHeader(workbook, header, "Divisi PIC Project", 12);
            createCellHeader(workbook, header, "Status", 13);

            if (data != null) {
                CellStyle style = workbook.createCellStyle();
                style.setBorderTop(CellStyle.BORDER_THIN);
                style.setBorderBottom(CellStyle.BORDER_THIN);
                style.setBorderLeft(CellStyle.BORDER_THIN);
                style.setBorderRight(CellStyle.BORDER_THIN);
                style.setAlignment(CellStyle.ALIGN_LEFT);
                int rowNum = 1;

                for (VoShowTableIkp cc : data) {
                    Row row = sheet.createRow(rowNum++);
                    int col = 0;

                    createCell(style, row, rowNum - 1, col++);
                    createCell(style, row, (String) cc.getIkpId(), col++);
                    createCell(style, row, (String) cc.getIdSupplier(), col++);
                    createCell(style, row, (String) cc.getNamaSupplier(), col++);
                    createCell(style, row, (String) cc.getTipeOrder(), col++);
                    if (((String) cc.getTipeOrder()).equals("PO")) {
                        createCell(style, row, (String) cc.getNomorPoSpk(), col++);
                    } else {
                        createCell(style, row, (String) cc.getNomorPoSpk(), col++);
                    }
                    createCell(style, row, (String) cc.getPlantId(), col++);
                    createCell(style, row, (String) cc.getNomorPengajuanProyek(), col++);
                    createCell(style, row, (String) cc.getLoginPatrol(), col++);
                    createCell(style, row, (String) cc.getNrpPic().toString(), col++);
                    createCell(style, row, (String) cc.getSeksi(), col++);
                    createCell(style, row, (String) cc.getDepartemen(), col++);
                    createCell(style, row, (String) cc.getDivisi(), col++);
                    createCell(style, row, (String) cc.getStatus(), col++);
                }
//                sheet.addMergedRegion(new CellRangeAddress(0, 0, 13, 14));
                for (int x = 0; x < sheet.getRow(0).getPhysicalNumberOfCells(); x++) {
                    sheet.autoSizeColumn(x, true);
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Fail generate excel file");
        }
        Date date = new Date();
         SimpleDateFormat format = new SimpleDateFormat("ddMMyyyyhhmmss");
        String fileName = "Maintain_Tabel_IKP_"+format.format(date);
        

        response.setHeader("Content-Disposition", "attachment ; fileName=\"" + fileName + ".xls\"");

    }

    private void createCellHeader(Workbook workbook, Row row, String obj, int col) {

        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        style.setAlignment(CellStyle.ALIGN_CENTER);

        style.setBorderTop(CellStyle.BORDER_THIN);
        style.setBorderBottom(CellStyle.BORDER_THIN);
        style.setBorderLeft(CellStyle.BORDER_THIN);
        style.setBorderRight(CellStyle.BORDER_THIN);

        font.setBoldweight(BOLDWEIGHT_BOLD);
        style.setFont(font);
        Cell cell = row.createCell(col);
        cell.setCellStyle(style);
        cell.setCellValue(obj);
    }

    private void createCell(CellStyle style, Row row, Object obj, int cellNum) {
        Cell cell = row.createCell(cellNum);

        if (obj instanceof Date) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
            cell.setCellStyle(style);
            cell.setCellValue(sdf.format((Date) obj));
        } else if (obj instanceof Number) {
            if (obj instanceof BigDecimal) {
                cell.setCellStyle(style);
                cell.setCellValue(((BigDecimal) obj).doubleValue());
            } else if (obj instanceof Double) {
                cell.setCellStyle(style);
                cell.setCellValue(((Double) obj).doubleValue());
            } else if (obj instanceof Long) {
                cell.setCellStyle(style);
                cell.setCellValue(((Long) obj).doubleValue());
            } else {
                cell.setCellStyle(style);
                cell.setCellValue((Integer) obj);
            }
        } else if (obj instanceof String) {
            cell.setCellStyle(style);
            cell.setCellValue((String) obj);
        } else {
            cell.setCellStyle(style);
            cell.setCellValue("");
        }
    }
}
