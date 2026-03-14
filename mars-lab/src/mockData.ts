import type { LabAsset } from './types'

const now = new Date()
const daysAgo = (n: number) => new Date(+now - n * 86_400_000).toISOString()
const daysFromNow = (n: number) => new Date(+now + n * 86_400_000).toISOString()

export const mockLabAssets: LabAsset[] = [
  // ── O+ Whole Blood ─────────────────────────────────────────────────────────
  {
    id: 'ast_001',
    donorId: 'usr_001',
    collectionTimestamp: daysAgo(3),
    expirationDate: daysFromNow(32),
    bloodType: 'O+',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'QUARANTINE',
    chainOfCustody: [
      { actor: 'Sr. Kagiso Letlhogile', action: 'COLLECTED', time: daysAgo(3) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(2) },
    ],
  },
  // ── A+ Plasma ──────────────────────────────────────────────────────────────
  {
    id: 'ast_002',
    donorId: 'usr_002',
    collectionTimestamp: daysAgo(5),
    expirationDate: daysFromNow(30),
    bloodType: 'A+',
    componentType: 'Plasma',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'TESTING',
    chainOfCustody: [
      { actor: 'Sr. Dineo Molapo', action: 'COLLECTED', time: daysAgo(5) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(4) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(3) },
    ],
  },
  // ── O- Platelets (HIV PENDING) ─────────────────────────────────────────────
  {
    id: 'ast_003',
    donorId: 'usr_003',
    collectionTimestamp: daysAgo(1),
    expirationDate: daysFromNow(34),
    bloodType: 'O-',
    componentType: 'Platelets',
    viralScreening: { hiv: 'PENDING', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'INCOMING',
    chainOfCustody: [
      { actor: 'Sr. Mpho Segotso', action: 'COLLECTED', time: daysAgo(1) },
    ],
  },
  // ── B- Whole Blood ─────────────────────────────────────────────────────────
  {
    id: 'ast_004',
    donorId: 'usr_004',
    collectionTimestamp: daysAgo(10),
    expirationDate: daysFromNow(25),
    bloodType: 'B-',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'RELEASED',
    chainOfCustody: [
      { actor: 'Sr. Kefilwe Ntlhane', action: 'COLLECTED', time: daysAgo(10) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(9) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(8) },
      { actor: 'Tech Oratile Dube', action: 'RELEASED', time: daysAgo(7) },
    ],
  },
  // ── AB+ RBC (BIOHAZARD) ────────────────────────────────────────────────────
  {
    id: 'ast_005',
    donorId: 'usr_005',
    collectionTimestamp: daysAgo(4),
    expirationDate: daysFromNow(31),
    bloodType: 'AB+',
    componentType: 'RBC',
    viralScreening: { hiv: 'POSITIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'BIOHAZARD',
    chainOfCustody: [
      { actor: 'Sr. Lesego Sithole', action: 'COLLECTED', time: daysAgo(4) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(3) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(2) },
      { actor: 'Supervisor Tau', action: 'BIOHAZARD', time: daysAgo(1) },
    ],
  },
  // ── A- Plasma ──────────────────────────────────────────────────────────────
  {
    id: 'ast_006',
    donorId: 'usr_006',
    collectionTimestamp: daysAgo(2),
    expirationDate: daysFromNow(33),
    bloodType: 'A-',
    componentType: 'Plasma',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'PENDING', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'TESTING',
    chainOfCustody: [
      { actor: 'Sr. Boitumelo Dithebe', action: 'COLLECTED', time: daysAgo(2) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(1) },
    ],
  },
  // ── B+ Whole Blood (expiring soon) ─────────────────────────────────────────
  {
    id: 'ast_007',
    donorId: 'usr_007',
    collectionTimestamp: daysAgo(30),
    expirationDate: daysFromNow(4),
    bloodType: 'B+',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'QUARANTINE',
    chainOfCustody: [
      { actor: 'Sr. Tebogo Mogorosi', action: 'COLLECTED', time: daysAgo(30) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(29) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(25) },
    ],
  },
  // ── AB- Platelets ──────────────────────────────────────────────────────────
  {
    id: 'ast_008',
    donorId: 'usr_008',
    collectionTimestamp: daysAgo(0),
    expirationDate: daysFromNow(35),
    bloodType: 'AB-',
    componentType: 'Platelets',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'INCOMING',
    chainOfCustody: [
      { actor: 'Sr. Onkabetse Tau', action: 'COLLECTED', time: new Date().toISOString() },
    ],
  },
  // ── O+ RBC (mobile drive — Serowe) ─────────────────────────────────────────
  {
    id: 'ast_009',
    donorId: 'usr_009',
    collectionTimestamp: daysAgo(6),
    expirationDate: daysFromNow(29),
    bloodType: 'O+',
    componentType: 'RBC',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'RELEASED',
    chainOfCustody: [
      { actor: 'Sr. Gosiame Phiri', action: 'COLLECTED', time: daysAgo(6) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(5) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(4) },
      { actor: 'Tech Oratile Dube', action: 'RELEASED', time: daysAgo(3) },
    ],
  },
  // ── O- Whole Blood (expiring critically) ───────────────────────────────────
  {
    id: 'ast_010',
    donorId: 'usr_010',
    collectionTimestamp: daysAgo(33),
    expirationDate: daysFromNow(2),
    bloodType: 'O-',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'QUARANTINE',
    chainOfCustody: [
      { actor: 'Sr. Neo Molefe', action: 'COLLECTED', time: daysAgo(33) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(32) },
    ],
  },
  // ── A+ Whole Blood ─────────────────────────────────────────────────────────
  {
    id: 'ast_011',
    donorId: 'usr_011',
    collectionTimestamp: daysAgo(7),
    expirationDate: daysFromNow(28),
    bloodType: 'A+',
    componentType: 'Whole Blood',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'TESTING',
    chainOfCustody: [
      { actor: 'Sr. Baboloki Senyatso', action: 'COLLECTED', time: daysAgo(7) },
      { actor: 'Tech Oratile Dube', action: 'RECEIVED', time: daysAgo(6) },
      { actor: 'Lab — NBTS Gaborone', action: 'TESTING', time: daysAgo(5) },
    ],
  },
  // ── B+ Plasma (Maun mobile drive) ──────────────────────────────────────────
  {
    id: 'ast_012',
    donorId: 'usr_012',
    collectionTimestamp: daysAgo(2),
    expirationDate: daysFromNow(33),
    bloodType: 'B+',
    componentType: 'Plasma',
    viralScreening: { hiv: 'NEGATIVE', hepB: 'NEGATIVE', hepC: 'NEGATIVE', syphilis: 'NEGATIVE' },
    status: 'QUARANTINE',
    chainOfCustody: [
      { actor: 'Sr. Dineo Ramotswe', action: 'COLLECTED', time: daysAgo(2) },
      { actor: 'Tech Kagiso Modise', action: 'RECEIVED', time: daysAgo(1) },
    ],
  },
]
