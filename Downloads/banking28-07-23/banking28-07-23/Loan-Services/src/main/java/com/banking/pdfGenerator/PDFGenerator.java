package com.banking.pdfGenerator;

import java.io.IOException;
import java.util.List;

import com.banking.model.Loan;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.CMYKColor;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import javax.servlet.http.HttpServletResponse;
import lombok.Data;
@Data 
public class PDFGenerator {

	// List to hold all Students
	private List<Loan> loanList;

	public List<Loan> getLoanList() {
		return loanList;
	}

	public void setLoanList(List<Loan> loanList) {
		this.loanList = loanList;
	}

	public void generate(HttpServletResponse response) throws DocumentException, IOException {

		// Creating the Object of Document
		Document document = new Document(PageSize.A4);

		// Getting instance of PdfWriter
		PdfWriter.getInstance(document, response.getOutputStream());

		// Opening the created document to modify it
		document.open();

		// Creating font
		// Setting font style and size
		Font fontTiltle = FontFactory.getFont(FontFactory.TIMES_ROMAN);
		fontTiltle.setSize(20);

		// Creating paragraph
		Paragraph paragraph = new Paragraph("List Of Loans", fontTiltle);

		// Aligning the paragraph in document
		paragraph.setAlignment(Paragraph.ALIGN_CENTER);

		// Adding the created paragraph in document
		document.add(paragraph);

		// Creating a table of 3 columns
		PdfPTable table = new PdfPTable(11);

		// Setting width of table, its columns and spacing
		table.setWidthPercentage(100f);
		table.setWidths(new int[] { 11,11,11,11,11,11 ,11,11 ,11,11,11});
		table.setSpacingBefore(5);

		// Create Table Cells for table header
		PdfPCell cell = new PdfPCell();

		// Setting the background color and padding
		cell.setBackgroundColor(CMYKColor.CYAN);
		cell.setPadding(5);

		// Creating font
		// Setting font style and size
		Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN);
		font.setColor(CMYKColor.WHITE);

		// Adding headings in the created table cell/ header
		// Adding Cell to table
		cell.setPhrase(new Phrase("ID", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("LoanNumber", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Loan Amount", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Monthly EMI", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Number of EMI'S paid", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Number of EMI'S remaining", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Tenure in months", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Loan Type", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Loan Status", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("Loan Paid date", font));
		table.addCell(cell);
		cell.setPhrase(new Phrase("InterestRate", font));
		table.addCell(cell);
		

		// Iterating over the list of students
		for (Loan loan : loanList) {
			// Adding student id
			table.addCell(String.valueOf(loan.getId()));
			// Adding student name
			table.addCell(String.valueOf(loan.getLoanNumber()));
			// Adding student section
			table.addCell(String.valueOf(loan.getAmount()));
			table.addCell(String.valueOf(loan.getEmi()));
			table.addCell(String.valueOf(loan.getPaidMonths()));
			table.addCell(String.valueOf(loan.getRemainingMonths()));
			table.addCell(String.valueOf(loan.getTermInMonths()));
			table.addCell(String.valueOf(loan.getLoanType()));
			table.addCell(String.valueOf(loan.getStatus()));
			table.addCell(String.valueOf(loan.getUpdatedAt()));
			table.addCell(String.valueOf(loan.getInterestRate()));



		}
		// Adding the created table to document
		document.add(table);

		// Closing the document
		document.close();

	}


}