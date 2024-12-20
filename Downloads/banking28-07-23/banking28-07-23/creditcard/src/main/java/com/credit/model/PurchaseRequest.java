package com.credit.model;

public class PurchaseRequest {
		private Long id;
		private double amount;
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public double getAmount() {
			return amount;
		}
		public void setAmount(double amount) {
			this.amount = amount;
		}
		public PurchaseRequest(Long id, double amount) {
			super();
			this.id = id;
			this.amount = amount;
		}
		public PurchaseRequest() {
			super();
			// TODO Auto-generated constructor stub
		}
}
