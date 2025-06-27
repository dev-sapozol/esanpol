"use client";

import React, { useState, useRef } from "react";
import styles from "./RegisterForm.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { registerWithHttpOnlyCookie } from "../../services/authService/RegisterWithHttpOnlyCookie";
import { fetchBasicUserData } from "../../services/userService/GetBasicDataUser";
import type { GetBasicDataUser } from "../../types/graphql"; // CORRECCIÓN: Asumiendo que 'User' es el tipo devuelto por fetchBasicUserData y lo renombramos
import { useUser } from "../../context/UserContext";
import i18n from "../../i18n";
import { useUpdateUser } from "../../features/register/hooks/useUpdateuser";
import { UpdateUserInput, Gender as GraphQLGender } from "../../types/graphql";
import type {
  RegisterResult as RegistrationServiceResult,
} from "../../services/authService/RegisterWithHttpOnlyCookie";

type Step = "fields" | "email" | "password" | "cellphone";

type HorizontalBrandingProps = {
  onBack?: () => void;
  showBackButton?: boolean;
};


const RegisterForm: React.FC = () => {
  countries.registerLocale(enLocale);
  const countryOptions = Object.entries(
    countries.getNames("en", { select: "official" })
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setUser } = useUser();
  const { updateUser } = useUpdateUser();

  const [step, setStep] = useState<Step>("fields");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Se llenará si tu lógica de registro devuelve el ID

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<GraphQLGender | "">("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [motherName, setMotherName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [error, setError] = useState("");

  const fieldsRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const cellphoneRef = useRef<HTMLDivElement>(null);
  const step1HeaderRef = useRef<HTMLDivElement>(null);

  const nextStepMap: Record<Step, Step | null> = {
    fields: "email",
    email: "password",
    password: "cellphone",
    cellphone: null,
  };

  const prevStepMap: Record<Step, Step | null> = {
    fields: null,
    email: "fields",
    password: "email",
    cellphone: "password",
  };

  const handleNavigateToNext = () => {
    const next = nextStepMap[step];
    if (next) setStep(next);
  };

  const handleNavigateToPrev = () => {
    const prev = prevStepMap[step];
    if (prev) setStep(prev);
  };

  const handleSubmitStep1Fields = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = [
      { value: name, message: t("register.error.nameRequired") },
      { value: fatherName, message: t("register.error.fatherNameRequired") },
      { value: birthday, message: t("register.error.birthdayRequired") },
      { value: gender, message: t("register.error.genderRequired") },
      { value: country, message: t("register.error.countryRequired") },
    ];
    for (const field of requiredFields) {
      if (!field.value) {
        alert(field.message);
        return;
      }
    }
    handleNavigateToNext();
  };

  const handleSubmitStep2Email = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@esanpol.xyz") || email.split("@")[0].trim() === "") {
      alert(t("register.error.emailRequired"));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_POST_API_URL}/email-exists?email=${encodeURIComponent(email)}`,
        { method: "GET", headers: { Accept: "application/json" }, credentials: "include" }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.exists) {
        alert(t("register.error.emailAlreadyUsed"));
      } else {
        handleNavigateToNext();
      }
    } catch (err) {
      console.error("Error checking email:", err);
      alert(t("register.error.checkingEmail"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep3PasswordAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      alert(t("register.error.passwordRequired"));
      return;
    }
    setLoading(true);
    try {
      const registrationResult: RegistrationServiceResult = await registerWithHttpOnlyCookie(
        {
          name,
          password,
          email,
          fatherName,
          motherName,
          country,
          gender: gender as string,
          birthday,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          role: "USER",
          language: i18n.language
        },
        t
      );

      if (registrationResult.status === "ok") {
        const userData = await fetchBasicUserData();
        if (userData) {
          setUser(userData);
          if (userData.id) {
            setUserId(userData.id);
          } else {
            console.error("User ID not found in fetched user data after registration.");
            throw new Error(t("register.error.failedToRetrieveUserId"));
          }
          handleNavigateToNext();
        } else {
          throw new Error(t("register.error.failedToFetchUserData"));
        }
      } else if (registrationResult.status === "email-already-exists") {
        alert(t("register.error.emailAlreadyUsed"));
      } else {
        throw new Error(t("register.error.unknownErrorCreatingUser"));
      }

    } catch (err: any) {
      console.error("Error en registro (paso 3):", err);
      alert(err.message || t("register.error.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCellphone = async () => {
    if (!cellphone.trim()) {
      alert(t("register.error.cellphoneRequired"));
      return;
    }
    if (!userId) {
      alert(t("register.error.userIdMissing"));
      console.error("CRITICAL: userId is null when trying to update cellphone.");
      return;
    }
    setLoading(true);
    try {
      const updateInputForHook: UpdateUserInput = {
        id: userId,
        cellphone: cellphone.trim()
      }

      const updatedUserResult = await updateUser(userId, updateInputForHook as UpdateUserInput);

      if (updatedUserResult && updatedUserResult.cellphone !== undefined) {
        setUser((prevUser: GetBasicDataUser| null) =>
          prevUser ? { ...prevUser, cellphone: updatedUserResult.cellphone } : null
        );
        alert(t("register.success.cellphoneAdded"));
        navigate("/mail/#inbox");
      } else {
        throw new Error(t("register.error.failedToUpdateUserWithCellphone"));
      }
    } catch (err: any) {
      console.error("Error updating cellphone (paso 4):", err);
      alert(err.message || t("register.error.updatingCellphone"));
    } finally {
      setLoading(false);
    }
  };

  const handleSkipCellphone = () => {
    navigate("/mail/#inbox");
  };

  let currentStepRef: React.RefObject<HTMLDivElement | null> = fieldsRef;
  let stepContent;

  const boxClassName = `${styles.registerBox} ${step !== "fields" ? styles.registerBoxHorizontal : ""}`;

  const HorizontalBranding: React.FC<HorizontalBrandingProps> = ({ onBack, showBackButton }) => (
    <div className={styles.horizontalLeftSection}>
      <div className={styles.brandingContent}>
        <img src="../../assets/SPLnoBordeSmall.png" alt="Logo Esanpol" />
        <h2>Esanpol</h2>
      </div>
      {showBackButton && onBack && (
        <button type="button" className={styles.backButton} onClick={onBack} aria-label={t("register.goBack")}>
          <span className={styles.backArrow}>←</span>
        </button>
      )}
    </div>
  );

  switch (step) {
    case "fields":
      currentStepRef = fieldsRef;
      stepContent = (
        <div ref={fieldsRef} className={styles.stepContentWrapper}>
          <h2 className={styles.registerTittle}>{t("auth.register.title")}</h2>
          <form className={styles.registerForm1Step} onSubmit={handleSubmitStep1Fields}>
            <input type="text" placeholder={t("form.fields.name")} value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
            <select value={country} onChange={(e) => setCountry(e.target.value)} disabled={loading} required>
              <option value="">{t("form.fields.country")}</option>
              {countryOptions.map(([code, name]) => (<option key={code} value={code}>{name}</option>))}
            </select>
            <div className={styles.separator1Step} />
            <input type="text" placeholder={t("form.fields.fatherName")} value={fatherName} onChange={(e) => setFatherName(e.target.value)} disabled={loading} required />
            <input type="text" placeholder={t("form.fields.motherName")} value={motherName} onChange={(e) => setMotherName(e.target.value)} disabled={loading} />
            <div className={styles.separator1Step} />
            <input type="date" placeholder={t("form.fields.birthday")} value={birthday} onChange={(e) => setBirthday(e.target.value)} disabled={loading} required />
            <select value={gender} onChange={(e) => setGender(e.target.value as GraphQLGender | "")} disabled={loading} required>
              <option value="" disabled hidden>{t("form.fields.gender")}</option>
              <option value={GraphQLGender.Male}>{t("form.gender.male")}</option>
              <option value={GraphQLGender.Female}>{t("form.gender.female")}</option>
              <option value={GraphQLGender.Other}>{t("form.gender.other")}</option>
            </select>
            <div className={styles.separator1Step} />
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t("register.loading") : t("form.fields.submit")}
            </button>
          </form>
        </div>
      );
      break;
    case "email":
      currentStepRef = emailRef;
      stepContent = (
        <div ref={emailRef} className={`${styles.stepContentWrapper} ${styles.horizontalStepContainer}`}>
          <HorizontalBranding onBack={handleNavigateToPrev} showBackButton={true} />
          <div className={styles.horizontalRightSection}>
            <form className={styles.registerForm2Step} onSubmit={handleSubmitStep2Email}>
              <div className={styles.emailWrapper}>
                <input type="text" placeholder={t("register.email")} value={email.split("@")[0]} onChange={(e) => { setEmail(e.target.value.trim() + "@esanpol.xyz"); setError(""); }} disabled={loading} required />
                <span className={styles.domainSuffix}>@esanpol.xyz</span>
              </div>
              {error && <p className={styles.errorText}>{error}</p>}
              <div className={styles.separatorHorizontalStep} />
              <button type="submit" disabled={loading}>
                {loading ? t("register.loading") : t("register.submit")}
              </button>
            </form>
          </div>
        </div>
      );
      break;
    case "password":
      currentStepRef = passwordRef;
      stepContent = (
        <div ref={passwordRef} className={`${styles.stepContentWrapper} ${styles.horizontalStepContainer}`}>
          <HorizontalBranding onBack={handleNavigateToPrev} showBackButton={true} />
          <div className={styles.horizontalRightSection}>
            <form className={styles.registerForm3Step} onSubmit={handleSubmitStep3PasswordAndRegister}>
              <input type="password" placeholder={t("login.password")} required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <div className={styles.separatorHorizontalStep}></div>
              <button type="submit" disabled={loading}>
                {loading ? t("register.loading") : t("register.createAccount")}
              </button>
            </form>
          </div>
        </div>
      );
      break;
    case "cellphone":
      currentStepRef = cellphoneRef;
      stepContent = (
        <div ref={cellphoneRef} className={`${styles.stepContentWrapper} ${styles.horizontalStepContainer}`}>
          <HorizontalBranding showBackButton={false} />
          <div className={styles.horizontalRightSection}>
            <div className={styles.registerForm4Step}>
              <input type="tel" placeholder={t("register.number")} value={cellphone} onChange={(e) => setCellphone(e.target.value)} disabled={loading} />
              <div className={styles.separatorHorizontalStep}></div>
              <div className={styles.step4Buttons}>
                <button type="button" onClick={handleSkipCellphone} className={`${styles.submitBtn} ${styles.skipButton}`} disabled={loading}>
                  {t("register.skip")}
                </button>
                <button type="button" onClick={handleUpdateCellphone} className={styles.submitBtn} disabled={loading || !cellphone.trim()}>
                  {loading ? t("register.loading") : t("register.addCellphone")}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    default:
      const exhaustiveCheck: never = step;
      stepContent = <div>Error: Paso desconocido {exhaustiveCheck}</div>;
  }

  return (
    <div className={boxClassName}>
      <CSSTransition
        in={step === "fields"}
        timeout={300}
        classNames={{
          enter: styles.headerEnter,
          enterActive: styles.headerEnterActive,
          exit: styles.headerExit,
          exitActive: styles.headerExitActive,
        }}
        nodeRef={step1HeaderRef}
        unmountOnExit
      >
        <div ref={step1HeaderRef} className={styles.registerHeaderStep1}>
          <img src="../../assets/SPLnoBordeSmall.png" alt="Logo Esanpol" />
          <h2>Esanpol</h2>
        </div>
      </CSSTransition>

      <SwitchTransition mode="out-in">
        <CSSTransition
          key={step}
          timeout={300}
          classNames={{
            enter: styles.slideEnter,
            enterActive: styles.slideEnterActive,
            exit: styles.slideExit,
            exitActive: styles.slideExitActive,
          }}
          nodeRef={currentStepRef} // CORRECCIÓN: currentStepRef ahora es RefObject<HTMLDivElement | null>
          unmountOnExit
        >
          {stepContent}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default RegisterForm;