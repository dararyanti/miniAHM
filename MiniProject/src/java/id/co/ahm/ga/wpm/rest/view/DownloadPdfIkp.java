package id.co.ahm.ga.wpm.rest.view;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Cell;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Rectangle;
import com.lowagie.text.Element;
import com.lowagie.text.pdf.PdfWriter;
import java.util.List;
import java.util.Map;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import id.co.ahm.ga.wpm.vo.VoShowAreaPekerjaan;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.view.document.AbstractPdfView;

/**
 *
 * @author Irzan Maulana
 */
public class DownloadPdfIkp extends AbstractPdfView {

    public static BufferedImage generateQRCodeImage(String barcodeText) throws Exception {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 100, 100);

        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    @Override
    protected Document newDocument() {
        Document doc = new Document(PageSize.A4.rotate());
        doc.setMargins(25f, 25f, 2f, 8f);
        return doc;
    }

    @Override
    protected void buildPdfDocument(Map<String, Object> model, Document dcmnt, PdfWriter writer,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        try {
            String headingLabel = "DATA IZIN KERJA PROYEK (IKP)";
            Paragraph heading = new Paragraph(headingLabel);
            heading.setAlignment(Element.ALIGN_CENTER);
            heading.getFont().setStyle(Font.BOLD);
            heading.getFont().setSize(14);
            heading.setSpacingAfter(20f);
            dcmnt.add(heading);

            Rectangle rect = new Rectangle(833, 589, 11, 12);
            rect.enableBorderSide(1);
            rect.enableBorderSide(2);
            rect.enableBorderSide(4);
            rect.enableBorderSide(8);
            rect.setBorderColor(Color.BLACK);
            rect.setBorder(Rectangle.BOX);
            rect.setBorderWidth(1);
            dcmnt.add(rect);

            VoShowTableIkp data = (VoShowTableIkp) model.get("IKP");
            float[] widthsTable = {0.3f, 0.2f, 0.01f, 0.3f, 0.15f, 0.01f, 0.15f, 0.01f, 0.15f};
            PdfPTable table = new PdfPTable(9) {
            };
            table.setWidthPercentage(100f);
            table.setWidths(widthsTable);

            table.addCell(setNonBorderLabel("Area"));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getPlantId()).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel("PIC Proyek AHM (Nama-Seksi)"));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getNamaPic()).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setBorderLabel(Optional.ofNullable(String.valueOf(data.getNrpPic())).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getSeksi()).orElse("-")));

            table.addCell(setNonBorderLabel("Nama Supplier"));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getNamaSupplier()).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));

            table.addCell(setNonBorderLabel("Nomor Izin Kerja Proyek"));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getIkpId()).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));

            table.addCell(setNonBorderLabel("Detail Proyek"));
            table.addCell(setBorderLabel(Optional.ofNullable(data.getProjectDetail()).orElse("-")));
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel("Tanggal Pekerjaan (Start-End)"));
            if (data.getStartJob() != null) {
                table.addCell(setBorderLabel(data.getStartJob().toString()));
            } else {
                table.addCell(setBorderLabel(""));
            }
            table.addCell(setNonBorderLabel(""));
            if (data.getEndJob() != null) {
                table.addCell(setBorderLabel(data.getEndJob().toString()));
            } else {
                table.addCell(setBorderLabel(""));
            }
            table.addCell(setNonBorderLabel(""));
            table.addCell(setNonBorderLabel(""));

            dcmnt.add(table);

            String labelArea = "Area Proyek";
            Paragraph headingArea = new Paragraph(labelArea);
            headingArea.getFont().setStyle(Font.BOLD);
            headingArea.getFont().setSize(9);
            headingArea.setSpacingAfter(2f);
            headingArea.setSpacingBefore(2f);
            dcmnt.add(headingArea);

            List<VoShowAreaPekerjaan> listAreaProject = data.getAreaPekerjaan();
            float[] widthsArea = {0.175f, 0.2f, 0.125f, 0.125f};
            PdfPTable tableArea = new PdfPTable(4) {
            };
            tableArea.setWidths(widthsArea);
            tableArea.setWidthPercentage(100f);
            tableArea.addCell(setColumnTitle("Nomor Asset"));
            tableArea.addCell(setColumnTitle("Area Detail"));
            tableArea.addCell(setColumnTitle("Indoor / Outdoor"));
            tableArea.addCell(setColumnTitle("Criticality"));
            for (int i = 0; i < listAreaProject.size(); i++) {
                tableArea.addCell(setColumnArea(Optional.ofNullable(listAreaProject.get(i).getAssetNo()).orElse("")));
                tableArea.addCell(setColumnArea(Optional.ofNullable(listAreaProject.get(i).getAreaDetail()).orElse("")));
                tableArea.addCell(setColumnArea(Optional.ofNullable(listAreaProject.get(i).getInOut()).orElse("")));
                tableArea.addCell(setColumnArea(Optional.ofNullable(listAreaProject.get(i).getCriticality()).orElse("")));
            }
            if (listAreaProject.size() == 0) {
                tableArea.addCell(setColumnArea("-"));
                tableArea.addCell(setColumnArea("-"));
                tableArea.addCell(setColumnArea("-"));
                tableArea.addCell(setColumnArea("-"));
            }
            dcmnt.add(tableArea);

            String labelSpace = " ";
            Paragraph headingSpace = new Paragraph(labelSpace);
            headingSpace.getFont().setStyle(Font.BOLD);
            headingSpace.getFont().setSize(6);
            headingSpace.setSpacingAfter(1f);
            headingSpace.setSpacingBefore(1f);
            dcmnt.add(headingSpace);

            int n = listAreaProject.size();
            if (n > 0) {
                PdfPTable tableQr = new PdfPTable(n);
                float[] widthsQr = new float[n];
                for (int i = 0; i < n; i++) {
                    widthsQr[i] = n * 100f / 6;
                }

                tableQr.setWidths(widthsQr);
                tableQr.setWidthPercentage(n * 100f / 6);
                tableQr.setKeepTogether(true);
                for (int j = 0; j < listAreaProject.size(); j++) {
                    tableQr.addCell(setColumnAreaBold(Optional.ofNullable(listAreaProject.get(j).getAssetNo()).orElse("")));
                }
                for (int j = 0; j < listAreaProject.size(); j++) {
                    tableQr.addCell(setColumnAreaMiddleSmall(Optional.ofNullable(listAreaProject.get(j).getAreaDetail()).orElse("Tidak ada Detail")));
                }
                for (int j = 0; j < listAreaProject.size(); j++) {
                    String dataQR = listAreaProject.get(j).getAssetNo();
                    BufferedImage bufferedImg = generateQRCodeImage(dataQR);
                    Image img = Image.getInstance(bufferedImg, null);
                    PdfPCell cell = new PdfPCell();
//                    cell.addElement(new Chunk(img, 5f, 20f));
                    cell.setImage(img);
                    tableQr.addCell(cell);
                }
                dcmnt.add(tableQr);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Fail generate PDF file");
        }
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("ddMMyyyyhhmmss");
        VoShowTableIkp data = (VoShowTableIkp) model.get("IKP");
        String fileName = "Detail_" + Optional.ofNullable(data.getIkpId()).orElse("null") + "_" + format.format(date);

        response.setHeader(
                "Content-Disposition", "attachment ; fileName=\"" + fileName + ".pdf\"");

    }

    private PdfPCell setColumnTitle(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.getFont().setStyle(Font.BOLD);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setFixedHeight(15f);
        return cell;
    }

    private PdfPCell setColumnTitleSpan(String label, int colSpan, int rowSpan) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setStyle(Font.BOLD);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setRowspan(rowSpan);
        cell.setColspan(colSpan);
        cell.setHorizontalAlignment(cell.ALIGN_CENTER);
        cell.setVerticalAlignment(cell.ALIGN_MIDDLE);
        return cell;
    }

    private Cell setColumnTitleSpesifikasi(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setStyle(Font.BOLD);
        paragraph.getFont().setSize(8);
        Cell cell = new Cell();
        cell.add(paragraph);
        return cell;
    }

    private PdfPCell setColumnAreaMiddle(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setHorizontalAlignment(cell.ALIGN_CENTER);
        cell.setVerticalAlignment(cell.ALIGN_MIDDLE);
        cell.setFixedHeight(87.5f);
        return cell;
    }

    private PdfPCell setColumnAreaMiddleSmall(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setHorizontalAlignment(cell.ALIGN_CENTER);
        cell.setVerticalAlignment(cell.ALIGN_MIDDLE);
        return cell;
    }

    private PdfPCell setColumnArea(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setFixedHeight(15f);
        return cell;
    }

    private PdfPCell setColumnAreaBold(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setStyle(Font.BOLD);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setHorizontalAlignment(cell.ALIGN_CENTER);
        cell.setVerticalAlignment(cell.ALIGN_MIDDLE);
        return cell;
    }

    private PdfPCell setNonBorderLabel(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setBorder(0);
        cell.setFixedHeight(15f);
        return cell;
    }

    private Cell setNonBorderLabelBold(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.setAlignment(Element.ALIGN_MIDDLE);
        paragraph.setAlignment(Element.ALIGN_CENTER);
        paragraph.getFont().setStyle(Font.BOLD);
        paragraph.getFont().setSize(10);
        Cell cell = new Cell();
        cell.add(paragraph);
        cell.setBorder(0);
        return cell;
    }

    private PdfPCell setBorderLabel(String label) {
        Paragraph paragraph = new Paragraph(label);
        paragraph.getFont().setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.addElement(paragraph);
        cell.setFixedHeight(15f);
        return cell;
    }

}
