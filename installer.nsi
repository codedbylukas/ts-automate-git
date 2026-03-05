; ============================================
;  NSIS Installer Script for git-tool
; ============================================

!include "MUI2.nsh"

; --- General Settings ---
Name "Git-Tool"
OutFile "for_installation/Windows/git-tool-setup.exe"
InstallDir "$PROGRAMFILES\git-tool"
InstallDirRegKey HKLM "Software\git-tool" "InstallDir"
RequestExecutionLevel admin

; --- Interface Settings ---
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; --- Pages ---
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; --- Language ---
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_LANGUAGE "German"

; --- Installer Section ---
Section "Install"
    SetOutPath "$INSTDIR"

    ; Copy the main executable
    File "for_installation/Windows/git-tool-64.exe"

    ; Rename to git-tool.exe for simpler CLI usage
    Rename "$INSTDIR\git-tool-64.exe" "$INSTDIR\git-tool.exe"

    ; Store installation directory in registry
    WriteRegStr HKLM "Software\git-tool" "InstallDir" "$INSTDIR"

    ; Create uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"

    ; Add to Windows Add/Remove Programs
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "DisplayName" "Git-Tool"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "InstallLocation" "$INSTDIR"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "Publisher" "codedbylukas"
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "NoModify" 1
    WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool" \
        "NoRepair" 1

    ; Add to system PATH via registry
    ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
    StrCpy $0 "$0;$INSTDIR"
    WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$0"

    ; Notify Windows that environment variables have changed
    SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000

    ; Create Start Menu shortcut
    CreateDirectory "$SMPROGRAMS\Git-Tool"
    CreateShortCut "$SMPROGRAMS\Git-Tool\Git-Tool.lnk" "$INSTDIR\git-tool.exe"
    CreateShortCut "$SMPROGRAMS\Git-Tool\Uninstall.lnk" "$INSTDIR\uninstall.exe"
SectionEnd

; --- Uninstaller Section ---
Section "Uninstall"
    ; Remove files
    Delete "$INSTDIR\git-tool.exe"
    Delete "$INSTDIR\uninstall.exe"

    ; Remove Start Menu shortcuts
    Delete "$SMPROGRAMS\Git-Tool\Git-Tool.lnk"
    Delete "$SMPROGRAMS\Git-Tool\Uninstall.lnk"
    RMDir "$SMPROGRAMS\Git-Tool"

    ; Remove installation directory
    RMDir "$INSTDIR"

    ; Remove from system PATH
    ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
    ; Read install dir from registry for removal
    ReadRegStr $1 HKLM "Software\git-tool" "InstallDir"
    ${If} $1 != ""
        ; Remove ";$INSTDIR" from PATH string
        StrCpy $2 ";$1"
        Push $0
        Push $2
        Call un.StrReplace
        Pop $0
        WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$0"
        SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
    ${EndIf}

    ; Remove registry keys
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\git-tool"
    DeleteRegKey HKLM "Software\git-tool"
SectionEnd

; --- String Replace Helper for Uninstaller ---
Function un.StrReplace
    Exch $R0 ; search string
    Exch
    Exch $R1 ; source string
    Push $R2
    Push $R3
    Push $R4
    StrLen $R3 $R0
    StrCpy $R4 ""
    loop:
        StrLen $R2 $R1
        IntCmp $R2 $R3 done done
        StrCpy $R2 $R1 $R3
        StrCmp $R2 $R0 found
        StrCpy $R2 $R1 1
        StrCpy $R4 "$R4$R2"
        StrCpy $R1 $R1 "" 1
        Goto loop
    found:
        StrCpy $R1 $R1 "" $R3
        Goto loop
    done:
        StrCpy $R0 "$R4$R1"
    Pop $R4
    Pop $R3
    Pop $R2
    Pop $R1
    Exch $R0
FunctionEnd
