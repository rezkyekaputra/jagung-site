! ==============================================================================
! JAGUNG NIDUN · SCIENTIFIC BIO-ENGINE
! Bahasa: GNU Fortran 14.3.1 (Gentoo Linux)
! Deskripsi: Komputasi matematis kurva pertumbuhan tanaman jagung (Zea mays),
!            akumulasi biomassa, integrasi GDD (Growing Degree Days),
!            serta auto-generator token SCSS & dataset JSON untuk web.
! ==============================================================================
program jagung_engine
  implicit none

  ! Parameter Simulasi Jagung Nidun
  real(8), parameter :: H_MAX   = 265.0d0      ! Tinggi maksimal tanaman (cm)
  real(8), parameter :: K_RATE  = 0.085d0      ! Laju pertumbuhan intrinsik (hari^-1)
  real(8), parameter :: T_INF   = 44.0d0       ! Titik belok kurva sigmoid (HST)
  real(8), parameter :: LAI_MAX = 4.85d0       ! Indeks Luas Daun maksimal (m2/m2)
  real(8), parameter :: PI      = 3.141592653589793d0

  integer :: day, unit_scss, unit_json, i
  real(8) :: t, height, lai, biomass, moisture, gdd_cum, daily_temp
  real(8) :: t_start, t_end, elapsed_ms
  integer(8) :: count_start, count_end, count_rate

  ! Catat waktu benchmark komputasi Fortran
  call system_clock(count_start, count_rate)

  print '(A)', "🌽 [JAGUNG NIDUN ENGINE] Memulai komputasi biometrik Zea mays..."

  ! ----------------------------------------------------------------------------
  ! 1. GENERATE DART SASS PARTIAL TOKENS (_corn_tokens.scss)
  ! ----------------------------------------------------------------------------
  open(newunit=unit_scss, file="/home/dongkrak/jagungnidun/src/scss/_corn_tokens.scss", status="replace")
  
  write(unit_scss,'(A)') "/// ========================================================="
  write(unit_scss,'(A)') "/// JAGUNG NIDUN · AUTO-GENERATED TOKENS BY FORTRAN 14 ENGINE"
  write(unit_scss,'(A)') "/// Jangan diedit manual! Di-generate dari jagung_engine.f90"
  write(unit_scss,'(A)') "/// ========================================================="
  write(unit_scss,'(A)') "@use 'sass:math';"
  write(unit_scss,'(A)') "@use 'sass:color';"
  write(unit_scss,'(A)') ""
  write(unit_scss,'(A)') "// Palet Warna Botani & Emas Jagung Nidun"
  write(unit_scss,'(A)') "$corn-gold-core:    #f59e0b;"
  write(unit_scss,'(A)') "$corn-gold-glow:    #fbbf24;"
  write(unit_scss,'(A)') "$corn-gold-deep:    #b45309;"
  write(unit_scss,'(A)') "$corn-leaf-emerald: #10b981;"
  write(unit_scss,'(A)') "$corn-leaf-deep:    #064e3b;"
  write(unit_scss,'(A)') "$corn-soil-dark:    #090d16;"
  write(unit_scss,'(A)') "$corn-silk-amber:   #d97706;"
  write(unit_scss,'(A)') ""
  write(unit_scss,'(A)') "// Animasi Denyut Fotosintesis Zea Mays (Formula Fisika Fortran)"
  write(unit_scss,'(A)') "@keyframes corn-photosynthesis-pulse {"

  ! Loop pernafasan tanaman (Keyframes sinusoidal Fortran)
  do i = 0, 10
    t = real(i, 8) / 10.0d0
    ! Variasi intensitas klorofil berbasis sinus
    write(unit_scss,'(A,F5.1,A)') "  ", (t * 100.0d0), "% {"
    write(unit_scss,'(A,F5.2,A,F5.2,A)') "    transform: scale(", (1.0d0 + 0.018d0 * sin(t * 2.0d0 * PI)), &
                                         ") translateY(", (-2.5d0 * sin(t * 2.0d0 * PI)), "px);"
    write(unit_scss,'(A,F4.2,A)') "    box-shadow: 0 12px 36px rgba(245, 158, 11, ", (0.22d0 + 0.18d0 * sin(t * PI)), ");"
    write(unit_scss,'(A)') "  }"
  end do

  write(unit_scss,'(A)') "}"
  write(unit_scss,'(A)') ""
  write(unit_scss,'(A)') "@keyframes gold-pollen-glow {"
  write(unit_scss,'(A)') "  0%, 100% { filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.45)); }"
  write(unit_scss,'(A)') "  50%      { filter: drop-shadow(0 0 28px rgba(251, 191, 36, 0.85)); }"
  write(unit_scss,'(A)') "}"
  write(unit_scss,'(A)') ""
  write(unit_scss,'(A)') "// Status Agrikultur Pre-Calculated"
  write(unit_scss,'(A,F6.1,A)') "$corn-max-height-cm: ", H_MAX, "cm;"
  write(unit_scss,'(A,F5.2,A)') "$corn-max-lai:       ", LAI_MAX, ";"

  close(unit_scss)
  print '(A)', "✅ [OK] src/scss/_corn_tokens.scss berhasil dibuat!"

  ! ----------------------------------------------------------------------------
  ! 2. GENERATE DATASET SIMULASI PERTUMBUHAN HARIAN (public/data_corn.json)
  ! ----------------------------------------------------------------------------
  open(newunit=unit_json, file="/home/dongkrak/jagungnidun/public/data_corn.json", status="replace")

  write(unit_json,'(A)') "{"
  write(unit_json,'(A)') '  "engine": "GNU Fortran 14.3.1 - Nidun Agro-Physics",'
  write(unit_json,'(A)') '  "variety": "Zea mays L. var. Nidun Premium Hybrid",'
  write(unit_json,'(A)') '  "max_height_cm": 265.0,'
  write(unit_json,'(A)') '  "potential_yield_ton_ha": 14.8,'
  write(unit_json,'(A)') '  "stages": ['
  write(unit_json,'(A)') '    {"day": 0,  "code": "VE", "name": "Emergensi (Tunas)", "desc": "Koleoptil menembus permukaan tanah." },'
  write(unit_json,'(A)') '    {"day": 18, "code": "V3", "name": "Fase Daun Tiga",   "desc": "Transisi dari nutrisi biji ke fotosintesis mandiri." },'
  write(unit_json,'(A)') '    {"day": 35, "code": "V6", "name": "Fase Elongasi",    "desc": "Inisiasi bakal tongkol dan akar tunjang." },'
  write(unit_json,'(A)') '    {"day": 52, "code": "V12","name": "Diferensiasi",     "desc": "Jumlah baris biji pada tongkol ditetapkan secara genetik." },'
  write(unit_json,'(A)') '    {"day": 65, "code": "VT", "name": "Tasseling (Bunga)","desc": "Munculnya malai bunga jantan & serbuk sari melimpah." },'
  write(unit_json,'(A)') '    {"day": 72, "code": "R1", "name": "Silking (Rambut)", "desc": "Polinasi rambut tongkol, penyerbukan 99% aktif." },'
  write(unit_json,'(A)') '    {"day": 85, "code": "R3", "name": "Milk Stage",       "desc": "Endosperma berisi cairan pati putih manis seperti susu." },'
  write(unit_json,'(A)') '    {"day": 100,"code": "R5", "name": "Dent Stage",       "desc": "Pengeringan pati membentuk lekukan khas (dent) di mahkota biji." },'
  write(unit_json,'(A)') '    {"day": 115,"code": "R6", "name": "Kematangan Fisiologis", "desc": "Lapisan hitam (black layer) terbentuk sempurna. Panen raya siap!" }'
  write(unit_json,'(A)') '  ],'
  write(unit_json,'(A)') '  "timeline": ['

  gdd_cum = 0.0d0
  do day = 0, 120
    t = real(day, 8)
    
    ! Kurva Sigmoid Tinggi: H(t) = H_max / (1 + exp(-k * (t - t_0)))
    height = H_MAX / (1.0d0 + exp(-K_RATE * (t - T_INF)))

    ! Indeks Luas Daun (LAI)
    if (day < 70) then
      lai = LAI_MAX / (1.0d0 + exp(-0.11d0 * (t - 40.0d0)))
    else
      lai = LAI_MAX * exp(-0.022d0 * (t - 70.0d0))
    end if

    ! Akumulasi Biomassa Kering per Tanaman (Gram)
    biomass = 380.0d0 / (1.0d0 + exp(-0.078d0 * (t - 60.0d0)))

    ! Kadar Air Biji (%)
    if (day < 65) then
      moisture = 85.0d0
    else
      moisture = 85.0d0 - (85.0d0 - 14.5d0) * ((t - 65.0d0) / 55.0d0)**1.25d0
    end if

    ! Kalkulasi GDD (Suhu Rata-rata 28 C - Base 10 C = 18 GDD/hari)
    daily_temp = 28.4d0 + 1.8d0 * sin(t * 0.15d0)
    gdd_cum = gdd_cum + max(0.0d0, daily_temp - 10.0d0)

    ! Tulis baris JSON
    if (day < 120) then
      write(unit_json,'(A,I3,A,F6.2,A,F5.2,A,F6.2,A,F5.1,A,F7.1,A)') &
        '    {"day":', day, ', "height":', height, ', "lai":', lai, &
        ', "biomass":', biomass, ', "moisture":', moisture, ', "gdd":', gdd_cum, '},'
    else
      write(unit_json,'(A,I3,A,F6.2,A,F5.2,A,F6.2,A,F5.1,A,F7.1,A)') &
        '    {"day":', day, ', "height":', height, ', "lai":', lai, &
        ', "biomass":', biomass, ', "moisture":', moisture, ', "gdd":', gdd_cum, '}'
    end if
  end do

  write(unit_json,'(A)') '  ]'
  write(unit_json,'(A)') "}"

  close(unit_json)
  print '(A)', "✅ [OK] public/data_corn.json berhasil dibuat!"

  ! Hitung durasi eksekusi Fortran
  call system_clock(count_end)
  elapsed_ms = (real(count_end - count_start, 8) / real(count_rate, 8)) * 1000.0d0
  print '(A,F6.3,A)', "🚀 Komputasi 120 HST Zea Mays tuntas dalam ", elapsed_ms, " ms!"

end program jagung_engine
