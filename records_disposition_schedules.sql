-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2025 at 01:11 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `erms`
--

-- --------------------------------------------------------

--
-- Table structure for table `records_disposition_schedules`
--

CREATE TABLE `records_disposition_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_number` varchar(255) NOT NULL,
  `record_series_title_and_description` varchar(255) NOT NULL,
  `record_series_title_and_description_1` longtext DEFAULT NULL,
  `active` bigint(20) NOT NULL,
  `storage` bigint(20) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `has_condition` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `records_disposition_schedules`
--

INSERT INTO `records_disposition_schedules` (`id`, `item_number`, `record_series_title_and_description`, `record_series_title_and_description_1`, `active`, `storage`, `remarks`, `has_condition`, `created_at`, `updated_at`) VALUES
(1, '1', 'AUDIT DOCUMENTATION', NULL, 2, 0, 'AFTER AUDIT', 1, '2025-02-05 18:14:09', '2025-02-05 18:14:09'),
(2, '2', 'BUSINESS CONTINUITY PLAN', NULL, 2, 0, 'PROVIDED UPDATED', 1, '2025-02-05 18:17:23', '2025-02-05 18:17:23'),
(3, '3', 'COMMUNICATIONS/CORRESPONDENCE (EXTERNAL/INTERNAL)', NULL, 2, 0, 'TO BE FILLED WITH APPROPRIATE RECORDS SERIES', 1, '2025-02-05 18:19:57', '2025-02-05 18:19:57'),
(4, '4', 'CONSUMPTION REPORTS', 'ELECTRICITY, PAPER, WATER', 1, 0, '', 0, '2025-02-05 18:20:41', '2025-02-05 18:20:41'),
(5, '5', 'COURIER/TRANSMITTAL SLIPS', NULL, 1, 0, '', 0, '2025-02-05 18:21:15', '2025-02-05 18:21:15'),
(6, '6', 'DIRECTIVES/ISSUANCES', NULL, 2, 0, 'AFTER SUPERSEDED', 1, '2025-02-05 18:32:39', '2025-02-05 18:32:39'),
(7, '7', 'LOGBOOKS', NULL, 2, 0, 'AFTER DATE OF LAST ENTRY', 1, '2025-02-05 18:33:16', '2025-02-05 18:33:16'),
(8, '8', 'MANUALS', NULL, 1, 0, 'AFTER SUSPERSEDED PROVIDED DIGITIZED', 1, '2025-02-05 18:34:15', '2025-02-05 18:34:15'),
(9, '9', 'MEETING FILES', NULL, 1, 0, 'AFTER AUDIT', 1, '2025-02-05 18:46:54', '2025-02-05 18:46:54'),
(10, '10', 'PLANNING CONFERENCE FILES', NULL, 2, 0, NULL, 0, '2025-02-05 18:51:56', '2025-02-05 18:51:56'),
(11, '11', 'REPORTS', NULL, 2, 0, NULL, 0, '2025-02-05 18:52:23', '2025-02-05 18:52:23'),
(12, '12', 'RISK CONTROL SELF ASSESSMENT (RCSA) MATRICES', NULL, 3, 0, NULL, 0, '2025-02-05 18:53:21', '2025-02-05 18:53:21'),
(13, '13', 'SIOURCE, INPUT, PROCESS, OUTPUT, CLIENT (SIPOC) RECORDS', NULL, 2, 0, NULL, 0, '2025-02-05 18:53:59', '2025-02-05 18:53:59'),
(14, '14', 'TRAINING/SEMINAR/BROCHURES/REFERENCE MATERIALS', NULL, 1, 0, 'AFTER SUPERSEDED', 1, '2025-02-05 18:55:07', '2025-02-05 18:55:07'),
(15, '15', 'BOND FILES', ' (ACTION , APPLICATION LETTER, INDEMNITY, LIST OF BONDED PERSONNEL)', 3, 0, 'AFTER EXPIRATION', 1, '2025-02-05 19:02:41', '2025-02-05 19:02:41'),
(16, '15B', 'BOND FILES', 'FIDELITY/SURETY', 5, 0, 'AFTER EXPIRATION', 1, '2025-02-05 19:03:40', '2025-02-05 19:03:40'),
(17, '16', 'BUDGET FILES', 'PROPOSAL, TRANSFER REQUEST/ADVICE, VARIANCE REPORTS', 1, 0, '', 0, '2025-02-05 19:04:54', '2025-02-05 19:04:54'),
(18, '17', 'MONTHLY REPORT ON REVENUE AND EXPENSE', NULL, 1, 0, NULL, 0, '2025-02-05 19:05:26', '2025-02-05 19:05:26'),
(19, '18', 'PETTY CASH', 'CASH BOOK, REPLENISHMENT REPORT, SUMMARY OF EXPENSE', 1, 0, 'AFTER DATE OF LAST ENTRY AND AUDITED ', 1, '2025-02-05 19:06:23', '2025-02-05 19:06:23'),
(20, '19', 'REPORT ON EXPENSE PAID BY OTHER BANK UNITS', 'REPOBU', 1, 0, '', 0, '2025-02-05 19:07:08', '2025-02-05 19:07:08'),
(21, '20', 'APPLICATION FOR LEAVE', NULL, 1, 0, 'AFTER SUBMISSION OF MONTHLY ATTENDANCE REPORT TO PAD FOR THE SAP HRIS', 1, '2025-02-05 19:08:53', '2025-02-05 19:08:53'),
(22, '21', 'ATTENDANCE SHEET/BLOTTER', NULL, 1, 0, NULL, 0, '2025-02-05 19:09:20', '2025-02-05 19:09:20'),
(23, '22', 'AUTHORITY TO RENDER OVERTIME', NULL, 1, 0, NULL, 0, '2025-02-05 19:09:49', '2025-02-05 19:09:49'),
(24, '23', 'AUTHORIZATION TO GO ON OFFICIAL BUSINESS', NULL, 1, 0, NULL, 0, '2025-02-05 19:10:12', '2025-02-05 19:10:12'),
(25, '24', 'CERTIFICATE OF APPEARANCE', NULL, 1, 0, NULL, 0, '2025-02-05 19:10:31', '2025-02-05 19:10:31'),
(26, '25', 'CLAIM FOR OVERTIME AND NIGHT DIFFERENTIAL', NULL, 1, 0, NULL, 0, '2025-02-05 19:11:01', '2025-02-05 19:11:01'),
(27, '26', 'DAILY TIME RECORD', NULL, 1, 0, 'AFTER SUBMISSION OF MONTHLY ATTENDANCE REPORT TO PAD FOR SAP HRIS', 1, '2025-02-05 19:11:42', '2025-02-05 19:11:42'),
(28, '27', 'EMPLOYEE CLEARANCE', NULL, 1, 0, NULL, 0, '2025-02-05 19:12:02', '2025-02-05 19:12:02'),
(29, '28', 'MONTHLY ATTENDANCE/ INVENTORY RFEPORT', NULL, 1, 0, NULL, 0, '2025-02-05 19:12:30', '2025-02-05 19:12:30'),
(30, '29', 'OFFICERS DAILY ATTENDANCE LOGBOOK', NULL, 1, 0, NULL, 0, '2025-02-05 19:12:57', '2025-02-05 19:12:57'),
(31, '30', 'OFFICERS  TIME RECORD', NULL, 1, 0, NULL, 0, '2025-02-05 19:13:12', '2025-02-05 19:13:12'),
(32, '31', 'AUTHORITY TO WITHDRAW SUPPLIES', NULL, 6, 0, NULL, 0, '2025-02-05 19:15:27', '2025-02-05 19:15:27'),
(33, '32', 'CERTIFICATE OF DISPOSAL RECORDS', NULL, 99999999999, 999999999, 'PERMANENT', 1, '2025-02-05 19:16:11', '2025-02-05 19:16:11'),
(34, '33', 'CERTIFICATION OF ACCESS RIGHTS FORM FOR ENROLLMENT/ USERS REQUEST', NULL, 1, 0, NULL, 0, '2025-02-05 19:16:57', '2025-02-05 19:16:57'),
(35, '34', 'INVENTORY FILES', NULL, 1, 0, 'AFTER UPDATED', 1, '2025-02-05 19:17:24', '2025-02-05 19:17:24'),
(36, '35', 'INVOICE RECEIPTS FOR PROPERTIES', NULL, 2, 0, 'AFTER DISPOSAL OF PROPERTY', 1, '2025-02-05 19:18:03', '2025-02-05 19:18:03'),
(37, '36', 'JOB ORDER REQUEST', NULL, 1, 0, 'AFTER ACTED UPON', 1, '2025-02-05 19:18:26', '2025-02-05 19:18:26'),
(38, '37', 'MEMORANDUM RECEIPTS FOR EQUIPMENT, SEMI EXPENDABLE AND NON- EXPENDABLE PROPERTY', NULL, 1, 0, 'AFTER CANCELLATION OF MR', 1, '2025-02-05 19:19:29', '2025-02-05 19:19:29'),
(39, '38', 'PREVENTIVE SERVICE MAINTENANCE AGREEMENT', NULL, 1, 0, 'AFTER TERMINATION / EXPIRATION', 1, '2025-02-05 19:20:28', '2025-02-05 19:20:28'),
(40, '39', 'PROCUREMENT REQUEST FORM /. REQUISITION ISSUE VOUCHER', NULL, 1, 0, NULL, 0, '2025-02-05 19:21:01', '2025-02-05 19:21:01'),
(41, '40', 'PROPERTY TRANSFER SLIPS', NULL, 1, 0, NULL, 0, '2025-02-05 19:22:14', '2025-02-05 19:22:14'),
(42, '41', 'RECORDS DISPOSITION SCHEDULE', NULL, 10, 0, 'AFTER SUPERSEDED', 1, '2025-02-05 19:22:43', '2025-02-05 19:22:43'),
(43, '42A', 'REPORTS', '(INVENTORY AND INSPECTION  OF UNSERVICEABLE PROPERTIES)', 1, 0, 'AFTER PROPERTY HAS BEEN DISPOSED ', 1, '2025-02-05 19:23:59', '2025-02-05 19:23:59'),
(44, '42B', 'REPORTS', '(PROPERTY DISPOSAL , SYSTEM INCIDENT, WASTE MATERIAL)', 1, 0, 'AFTER ACTED UPON ', 1, '2025-02-05 19:24:38', '2025-02-05 19:24:38'),
(45, '43', 'STOCK CARDS ON SUPPLIES', NULL, 1, 1, NULL, 0, '2025-02-05 19:25:02', '2025-02-05 19:25:02'),
(46, '44', 'STOCK POSITION SHEET', NULL, 1, 0, NULL, 0, '2025-02-05 19:25:23', '2025-02-05 19:25:23'),
(47, '45A', 'TURNOVER LISTING AND DISPOSAL AUTHORITY', NULL, 99999999, 0, 'PERMANENT', 1, '2025-02-05 19:26:05', '2025-02-05 19:26:05'),
(48, '45B', 'TURNOVER LISTING AND DISPOSAL AUTHORITY', '(TEMPORARY RECORDS)', 1, 0, 'AFTER DISPOSAL DATE AND AUDIT ', 1, '2025-02-05 19:26:58', '2025-02-05 19:26:58'),
(49, '85', 'ABSTRACTS (PAYMENT AND REMITTANCE)', NULL, 2, 3, 'PROVIDED AUDITED', 1, '2025-02-05 20:27:24', '2025-02-05 20:27:24'),
(50, '86', 'ACCOUNT OPENING SCREEN PRINT-OUTS (FIAS/RM)', NULL, 1, 2, 'PROVIDED AUDITED', 1, '2025-02-05 20:28:48', '2025-02-05 20:28:48'),
(51, '88', 'ANTI-MONEY LAUNDERING ACT(AMLA) RELATED RECORDS', 'AMLA - DATA ENTRY SYSTEM TRANSACTION RECORDS\nQUARTERLY CERTIFICATION\nREPORTS\n	COVERED TRANSACTION (CTR)\n	SUSPICIOUS TRANSACTION (STR)\nSAS ALERTS', 1, 4, 'PROVIDED AUDITED', 1, '2025-02-05 20:44:28', '2025-02-05 20:44:28'),
(52, '89', 'APPLICATION (Demand Draft/Electronic Money Transfer/ Gift Checks/ Manager\'s Checks/ Traveller\'s Check/ Outgoing Telegraphic Transfer)', NULL, 1, 4, 'Provided Negotiated', 1, '2025-02-05 20:49:42', '2025-02-05 20:49:42'),
(53, '90', 'AUTHORITY FOR FUND TRANSFER(Credit/Debit Memo)', NULL, 2, 0, 'Accounting Center Copies shall be retained for 10 years', 1, '2025-02-05 20:51:03', '2025-02-05 20:51:03'),
(54, '91', 'AUTHORIZATION LETTERS', 'Bank Certificate\nCheckbook\nIncoming Returned Checks\nSnap Shot', 1, 2, NULL, 0, '2025-02-05 20:52:15', '2025-02-05 20:52:15'),
(55, '93', 'AUTOMATED TELLER MACHINE (ATM) CARD REQUEST AND UPDATE FORMS(ACRUF) WITH SUPPORTING DOCUMENTS', NULL, 2, 8, NULL, 0, '2025-02-05 20:53:26', '2025-02-05 20:53:26'),
(56, '94', 'BRANH LOAN FILES(Livelihood and Hold-out)', 'Government/Judicial Entities\nIndividual Borrower', 1, 4, 'AFTER FULL PAYMENT AND FINAL SETTLEMENT TERMINATION OF LOAN', 1, '2025-02-05 20:55:22', '2025-02-05 20:55:22'),
(57, '94', 'BUREAU OF CUSTOMS (BOC) FILES', 'Transaction Reports\n     Cargo Transfer Fees(ASYCUDA)\n      Revenue Accounting Division\nElectronic to Mobile (e2M)/Additional Payment\n   BOC Revenue Accounting Division \nMonthly\n   Reports\n   Daily\n   Detailed\nPayment Application Secure System 5 (PASS 5)\nReports\n  Internet Generated Report on PASS \n  5 Payment\n  Summary on Daily Transaction on \nPASS 5 Payment', 1, 4, NULL, 0, '2025-02-05 21:04:26', '2025-02-05 21:04:26'),
(58, '95', 'BUREAU OF INTERNAL REVENUE FILES', 'Electronic Documentary Stamp (eDST)\n     Book of Documentary Stamp \n     Daily Transaction\n     Report on Sales/Usage of \n     Documentary Stamps\n     Summary of Documentary Stamp \n      Tax Paid and\n      Remitted\nOver-the-Counter (OTC) Collections\n      External Media Transmittal (Form 2840)\n       Report of BIR Returned/Dishonored Checks\n        Taxpayer’s Payment Batch Control Sheets (BCS)', 1, 4, NULL, 0, '2025-02-05 21:31:25', '2025-02-05 21:31:25'),
(59, '96', 'CAUTION NOTICES', 'Foreign Bank Notes Alert\n    Lost Certificate of Time Deposit (CTD)\n    Lost Checks', 2, 0, 'After account closure', 1, '2025-02-05 21:32:50', '2025-02-05 21:32:50'),
(60, '97', 'CASH CARD APPLICATIONS', NULL, 2, 8, 'AFTER ACCOUNT CLOSURE', 1, '2025-02-05 21:34:55', '2025-02-05 21:34:55'),
(61, '98', 'CAUTION NOTICES', NULL, 2, 0, NULL, 0, '2025-02-05 21:35:24', '2025-02-05 21:35:24'),
(62, '99', 'CERTIFICATIONS', 'Deposit and Existing Account\nIDRARS Branch Certification', 2, 3, 'PROVIDED AND AUDITED', 1, '2025-02-05 21:36:15', '2025-02-05 21:36:15'),
(63, '100A', 'CHECKBOOK REQUISITIONS', 'Customer Request', 3, 0, NULL, 0, '2025-02-05 21:37:22', '2025-02-05 21:37:22'),
(64, '100B', 'CHECKBOOK REQUISITION', 'Screen Print-out Application', 2, 0, NULL, 0, '2025-02-05 22:08:14', '2025-02-05 22:08:14'),
(65, '101', 'CLIENT COMPLAINT FORM', NULL, 1, 0, NULL, 0, '2025-02-05 22:08:33', '2025-02-05 22:08:33'),
(66, '102', 'CONFIRMATION OF SALES/PURCHASES OF GOVERNMENT/PRIVATE SECURITIES', NULL, 1, 4, 'After Termination', 1, '2025-02-05 22:09:05', '2025-02-05 22:09:05'),
(67, '103', 'CORPORATE ACCOUNT FILES', 'Affidavit of Lost Passbook (if applicable)\nArticle of Incorporation and By-Laws\nBackground/Credit Investigation\nBoard Resolution with Authorized Signatories and\nAuthority to Open Account\nBusiness Permit\nCustomer Information and Specimen Signature Card\nof Corporate Authorized Signatories with Supporting\nDocuments\nCustomer Information Sheet of Corporation\nGeneral Information Sheet\nRegistration Documents (e.g.SEC/DTI/CDA,etc.)\nSecretary\'s Certificate', 1, 4, 'After Termination', 1, '2025-02-05 22:09:52', '2025-02-05 22:09:52'),
(68, '104', 'DEPOSIT ACCOUNT ADJUSTMENTS (ST24) WITH SUPPORTING DOCUMENTS', NULL, 2, 0, 'After account closure', 1, '2025-02-05 22:11:29', '2025-02-05 22:11:29'),
(69, '105', 'DORMANT DEPOSIT ACCOUNT FILES', 'Certificate of Mailing\nList of Returned Mail\nNotice to Depositor\nNotice to Depositor of Impending Dormancy\nProof of Mail Delivery\nSchedules\nDormant Deposit Accounts (SDDA)\nNotice to Depositor of Impending Dormancy\nNotice of Dormancy\nUnclaimed Balances Accounts (SUBA)\nSpecial Power ofAttorney (if applicable)\nSworn Statement of Unclaimed Balances (SSUB)', 2, 0, 'After escheatment Provided audited', 1, '2025-02-05 22:12:28', '2025-02-05 22:12:28'),
(70, '106', 'e-BANKING PRODUCTS ENROLMENT RECORDS', '(Access\nPhone Access\nweAccess', 2, 8, NULL, 0, '2025-02-05 22:14:15', '2025-02-05 22:14:15'),
(71, '107', 'E-CARD APPLICATION (DATA CAPTURED)', NULL, 2, 8, NULL, 0, '2025-02-05 22:14:42', '2025-02-05 22:14:42'),
(72, '1', 'AUDITJHDJKHDKH', NULL, 2, 0, NULL, 0, '2025-02-05 22:14:58', '2025-02-05 22:14:58'),
(73, '108', 'EURO SAVINGS LEDGER CARDS', NULL, 1, 4, 'After account closure', 1, '2025-02-05 22:36:38', '2025-02-05 22:36:38'),
(74, '109', 'EXCHANGE BOUGHT TICKETS', NULL, 2, 0, 'Accounting Center\'s copy shall be retained for 10 years', 1, '2025-02-05 22:37:51', '2025-02-05 22:37:51'),
(75, '110', 'FOREIGN CURRENCY DEPOSIT UNIT (FCDU/PESO WIRE TRANSFER FILES', 'Application to Purchase\nForeign Currencies (Dollar & 3rd Currencies)\nPeso\nCredit /Inter-Office Advice (IOA)\nGross Settlement Real Time (GSRT) - Dollar to Dollar\n(Local)\nOutgoing Telegraphic Transfer (MT 103)\nReal Time Gross Settlement (RTGS) - Peso to Peso\n(Local)', 2, 0, 'Accounting Center\'s copy shall be retained for 10 years', 1, '2025-02-05 22:40:23', '2025-02-05 22:40:23'),
(76, '111', 'INCOMING CLEARING CHECKS (ICC) CONFIRMATION SHEETS WITH PHOTOCOPY OF CHECKS', NULL, 1, 4, NULL, 0, '2025-02-05 22:41:06', '2025-02-05 22:41:06'),
(77, '112', 'INDIVIDUAL ACCOUNT FILES', 'Background/Credit Investigation\nCustomer Information Sheet\nCustomer Information and Specimen Signature Card\nwith Supporting Documents\nLetter of Introduction\nPhotocopy of Valid Identification Card (ID)\nSpecial Power of Attorney\nForeign\nLocal\nPensioners', 1, 4, 'After account closure', 1, '2025-02-05 22:41:37', '2025-02-05 22:41:37'),
(78, '113', 'INTERBRANCH CONFIRMATION ON DEPOSIT AND WITHDRAWALS', NULL, 1, 4, NULL, 0, '2025-02-05 22:41:58', '2025-02-05 22:41:58'),
(79, '114', 'INTER-DEPARTMENT TRANSACTION CONFIRMATION SHEETS', NULL, 2, 0, NULL, 0, '2025-02-05 22:42:12', '2025-02-05 22:42:12'),
(80, '115', 'LEASE CONTRACTS', NULL, 3, 2, 'After termination and full settlement', 1, '2025-02-05 22:42:39', '2025-02-05 22:42:39'),
(81, '116', 'LOGBOOK', 'Accountable Form\nAlarm Testing\nATM Access\nBank Statements (B/S)\nCaptured Card\nCheck Book Issuance\nClient\'s Complaint\nDemand Draft Issuance\nDuplicate Keys\nGift Check Issuance\nIncoming Clearing Checks (ICC)\nIncoming Returned Checks (IRC)\nInstant Cards Registry\nItems Held for Safekeeping/Collateral\nLate Deposit\nPassbook (Receiving)\nReturned Checks and Other Clearing Items (RCOCI)\nSafe Deposit Box Access\nStop Payment Order (SPO)\nSystem Access\nVault Registry', 2, 0, 'After date of last entry', 1, '2025-02-05 22:43:24', '2025-02-05 22:43:24'),
(82, '117', 'MEMORANDA OF AGREEMENTS', NULL, 2, 3, 'After termination/renewal', 1, '2025-02-05 22:43:53', '2025-02-05 22:43:53'),
(83, '118', 'MODIFIED DISBURSEMENT SCHEME(MDS) FILES', 'Notice of Transfer Allocation (NTA)\nSummary of Notice of Cash Allocation', 3, 0, 'Provided audited', 1, '2025-02-05 22:44:55', '2025-02-05 22:44:55'),
(84, '119', 'NEGOTIATED CHECKS', 'Demand Draft\nGift Check\nManager\'s Checks', 1, 4, NULL, 0, '2025-02-05 22:46:25', '2025-02-05 22:46:25'),
(85, '120', 'NOTICES/WARRANT OF GARNISHMENTS', NULL, 1, 0, 'After termination of case/\nAfter receipt of Notice of Lifting', 1, '2025-02-05 22:46:52', '2025-02-05 22:46:52'),
(86, '121A', 'OFFICIAL RECEIPTS (Branch Copy)', 'LBP', 3, 7, 'Provided post-audited', 1, '2025-02-05 22:47:26', '2025-02-05 22:47:26'),
(87, '121B', 'OFFICIAL RECEIPTS (Branch Copy)', 'Special Bank Receipt-Other Agencies (LBP Copy)', 2, 0, NULL, 0, '2025-02-05 22:47:51', '2025-02-05 22:47:51'),
(88, '122', 'OVERSEAS FILIPINO ACCOUNT FILES', 'Certification\nKnow-Your-Client\nOpening\nUpdating\nLBP Overseas Filipino Customer Information Sheet\nOriginal\nScanned', 0, 4, 'After account closure', 1, '2025-02-05 22:48:19', '2025-02-05 22:48:19'),
(89, '123', 'PANTAWID PAMILYANG PILIPINO PROGRAM (4Ps) FILES', 'Acknowledgement Receipt\nConsolidated Order of Payment\nSchedule/List of Paid Beneficiaries (CCT Pay-Out)', 3, 7, 'Provided post audited', 1, '2025-02-05 22:48:49', '2025-02-05 22:48:49'),
(90, '124', 'PHILIPPINE VETERANS AFFAIRS OFFICE (PVAO) FILES', 'Summary of PVAO Regular Pension for the Month\nSummary of PVAO Total Administrative Disability\nPension for the Month', 1, 0, NULL, 0, '2025-02-05 22:49:13', '2025-02-05 22:49:13'),
(91, '125', 'PHOTOCOPIES OF U S. DOLLAR AND OTHER FOREIGN CURRENCY NOTES FOR COUNTERFEIT VERIFICATION', NULL, 1, 4, NULL, 0, '2025-02-05 22:49:38', '2025-02-05 22:49:38'),
(92, '126', 'PROPOSAL FOR CONSTRUCTION/RENOVATION/ LEASE RELOCATION OF BRANCH SITE', NULL, 2, 5, NULL, 0, '2025-02-05 22:49:55', '2025-02-05 22:49:55'),
(93, '127', 'RECEIPTS FOR COLLECTION ITEMS - OUTWARD', NULL, 0, 0, NULL, 0, '2025-02-05 22:50:23', '2025-02-05 22:50:23'),
(94, '128', 'REGISTERS', 'Account Number\nCard Number', 99999999, 0, NULL, 0, '2025-02-05 22:52:55', '2025-02-05 22:52:55'),
(95, '129', 'REGISTRIES OF MANAGER\'S CHECK/GIFT CHECK/DEMAND DRAFT', NULL, 3, 7, 'After date of last entry', 1, '2025-02-05 22:53:28', '2025-02-05 22:53:28'),
(96, '130A', 'REPORTS', 'Automated Teller Machine (ATM) System Generated\nATM Transmittal\nAutomated ATM Reconciliation System (AARS) -\nDaily\nATM Cash Proofsheet/Cash Count Sheet\nATM Checklist\nElectronic Journal Daily Reading\nLists of Reconciliation Items\nConsolidated\nTagged\nUnresolved', 2, 3, 'Provided audited', 1, '2025-02-05 22:55:22', '2025-02-05 22:55:22'),
(97, '130B', 'REPORTS', 'Automated Teller Machine (ATM) Transaction and\nActivity\nCash Count Sheet\nCash-ln-Vault Summary\nConsolidated ATM Cash Flow\nList of Retained Cards\nSystematics Report (printed)\nAccount with Negative Balance\nAccount with Zero Balance (ST/IM)\nAccumulation of Totals\nDemand Deposit Account (DDA)\nModified Disbursement Scheme (MDS).\nSystematics Report (printed)\nAccumulation of Totals\nSavings Account (SA)\nTime Deposit (CD)\nAgrarian Reform Receivables System\nFully Paid Account and Other Basic Data\nList of Agrarian Reform Beneficiaries (ARBs)\nwith Foreclosable Account\nNon-Monetary Transaction\nOutstanding Agrarian Reform Receivable\n(ARR) by Movement\nSummary of Foreclosed Lot\n\nProvided audited\n\nATM\nEntered Interbranch Transaction\nCards Issued/Reissued\nPIN Mailers Issued\nBalance Run-Up\nBills Payment Journal\nClearing Items (Interbranch Transaction)\nClosed Accounts\nClosed Today\nConsolidated Daily Savings Deposit Account\n(SDA) Balance Run-Up\nConsolidated Unutilized Notice of Cash Allocation\n(NCA)\nCurrent Account (ACIC File Maintenance)\nCustomer Information System/Central Liability\nSystem (CIS/CLS)\nException Item\nData Extraction for Symbols\nBalances\nSymbols Extraction\nDaily Balance Run-Up\nDaily Callbacking Activity (DCA) Report, Online\n& ATM-entered\nDeduction List\nDormant Account Activity\nDormant Activity\nElectronic Payment Collection Journal\nElectronic Tax Payment System (ETPS)\nEmployee Transaction\nESP Documentary Stamp Reports\nFCDU Accumulation of CD Totals\nFile Maintenance Journal\nFloat Schedule\nFund Transfer (Phone Banking)\nJournal\nDestination\nSource\nMaintenance\nService Charge\nInterbranch Transaction Online System (IBTOLS)\nConsolidated Reconciliation Statement\nDaily Report on Cancelled/Deleted\nTransactions\nItems for Responding\nItems Originated Not Yet Responded\nSystematics Report (printed)\nIMPACS Balance Run-Up\nIncoming Electronic Money Transfer\nInterest/Balance of Accounts\nInterest Bearing Current Account (IBCA)\nIBCA Balance Run-Up\nInterest Expense\nInterest Paid (ESP/HYSA)\nLapsed Transfer Journal\nLivelihood Loan System (LLS)\nLoan Adjustment\nPayment Transactions\nReleased Transaction\nSchedule\nAmount Due and Collection\nCredit Life Insurance\nLivelihood Loan\nOutstanding Loan\nPast Due Account\nSummary of Loan Availer\nTransaction Posting Summary\nMaintenance Journal\nMaintenance Reject\nMaturing HYSA Deposit\nPDIC Summary\nPhilippine Peso/US Dollar Online - Entered\nInterbranch Transaction\nPhone Access: Check Request Schedule\nPIN Mailers Issued Report\nPosting Reject Journal\nProcessing Recap (CA,SA, CTD)\nProjected CD Maturities Today\nRenewal/Roll-over Report\nReport on Escheat Account\nRetail Treasury Bonds (RTB)\nConsolidated Sales\nDaily Summary of Transaction\nSavings Transaction Journal\nSavings Trial Balance/Transaction Journal\nSchedule of Time Deposits Classified by Maturity\n& Rate\nSDA Account: Daily Transaction Journal\nSignificant Balance Change Report\nStatement\nAccount\nCurrent Year\nPrevious Year\nNegotiated Check\nCurrent Year\nPrevious Year\nStop/Hold/Pledge Journal (CA/SA)\nStop/Hold/Pledge Maintenance (CA/SA)\nSummary of CTD FCDU Deposit\nSummary Report\nForeign Exchange (FX) Charge\nInterbranch Transaction\nweAccess Checkbook Reorder\nSystematics Report (printed)\nSweep Statistics (Outstanding Loans by Loan\nStatus)\nTop BIR/BOC Collections\nTop Ten Report\nTransaction Exception (BET/Current - Regular)\nTransaction Total Reports/Summary (CA/SA)\nWeekly Schedule of Check Request\nTransmittal\nCCVS Balancing Summary/Transmittal Sheet\nfrom Central Clearing Department\nDaily Transaction Transmittal Sheet to\nAccounting Center\nElectronic Check Clearing System\nTransmittal List of Outward Check Daily Report\nwith Photocopy of Check', 1, 0, 'Provided audited', 1, '2025-02-05 22:58:41', '2025-02-05 22:58:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `records_disposition_schedules`
--
ALTER TABLE `records_disposition_schedules`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `records_disposition_schedules`
--
ALTER TABLE `records_disposition_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
